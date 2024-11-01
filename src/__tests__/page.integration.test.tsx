import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import "@testing-library/jest-dom";
import Home from "../app/page";
import { connectWalletToSepolia, getBalance } from "../lib/utils/ethers";
import { useToast } from "@chakra-ui/react";
import { fetchWalletTransactions } from "@/services/transactions/fetchWalletTransactions";

jest.mock("../lib/utils/ethers", () => ({
  connectWalletToSepolia: jest.fn(),
  switchToSepolia: jest.fn(),
  getProvider: jest.fn(() => ({
    getNetwork: jest.fn(() => Promise.resolve({ chainId: 11155111 })),
  })),
	getBalance: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));

jest.mock("../lib/utils/truncateAddress", () => jest.fn((address) => address));
jest.mock("../services/transactions/fetchWalletTransactions", () => ({
  fetchWalletTransactions: jest.fn(),
}));

describe("Main Page", () => {
	beforeEach(() => {
    global.fetch = jest.fn();
  });

	afterEach(() => {
    jest.clearAllMocks();
  });

	it("renders TopBar, Welcome text correctly", () => {
    render(<Home />);

    // Check for the presence of WalletConnection button
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Wallet Transfer/i)).toBeInTheDocument();
  });

	it("connects wallet and updates BalanceDisplay and TransactionHistory", async () => {
		// Mock wallet connections and transactions
    (connectWalletToSepolia as jest.Mock).mockResolvedValue("0x1234...abcd");
		(getBalance as jest.Mock).mockResolvedValue("100");
		(useToast as jest.Mock).mockReturnValue(jest.fn());
		(fetchWalletTransactions as jest.Mock).mockResolvedValue([
			{
				txHash: "0x5678...efgh",
				from: "0x1234...abcd",
				to: "0x2233...bcde",
				amount: "100",
				timestamp: 1679619200000,
			}
		]);

    render(<Home />);

    // Simulate wallet connection
    const connectButton = screen.getByTestId('connect-wallet');
    fireEvent.click(connectButton);

    await waitFor(() => {
      // Check if the wallet connection triggers state updates and UI changes
      expect(connectWalletToSepolia).toHaveBeenCalled();
      expect(screen.getByTestId('wallet-address-menu')).toBeInTheDocument();
			expect(screen.getByText(/Copy Address/i)).toBeInTheDocument();
			expect(screen.getByText(/Disconnect/i)).toBeInTheDocument();
			expect(screen.queryByRole("button", { name: /connect wallet/i })).not.toBeInTheDocument();

			// Check if BalanceDisplay updated based on address
			expect(screen.getByText(/Welcome to Wallet Transfer/i)).toBeInTheDocument();
			expect(screen.getByText(/wallet balance/i)).toBeInTheDocument();
			expect(screen.getByText(/100 ETH/i)).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /Send ETH/i })).toBeInTheDocument();

			// Check if TransactionHistory updated based on address
			expect(screen.getByText(/transaction history/i)).toBeInTheDocument();
			expect(screen.getAllByTestId('transaction-row').length).toBe(1);
			expect(screen.getByTestId('transaction-row').textContent).toContain("0x5678...efgh");
			expect(screen.getByTestId('transaction-row').textContent).toContain("0x1234...abcd");
			expect(screen.getByTestId('transaction-row').textContent).toContain("0x2233...bcde");
    });
	});

	it("disconnects wallet and clears BalanceDisplay and TransactionHistory", async () => {
    (connectWalletToSepolia as jest.Mock).mockResolvedValue("0x1234...abcd");

    render(<Home />);

    // Connect the wallet first
    const connectButton = screen.getByRole("button", { name: /connect wallet/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByTestId('wallet-address-menu')).toBeInTheDocument();
    });

    // Simulate disconnecting the wallet
    fireEvent.click(screen.getByTestId('wallet-address-menu'));
    fireEvent.click(screen.getByTestId('disconnect'));

    await waitFor(() => {
      // Verify wallet address is cleared, and components are reset
      expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
			expect(screen.getByText(/Welcome to Wallet Transfer/i)).toBeInTheDocument();
    });
  });
});

