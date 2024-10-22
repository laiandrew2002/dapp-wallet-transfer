import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TransferModal from '../../components/TransferModal'
import { ethers } from 'ethers'
import { sendTransaction } from '../../lib/utils/ethers'

// Mock external dependencies
jest.mock('../../lib/utils/ethers', () => ({
  sendTransaction: jest.fn()
}))

// Mock ethers utility functions
jest.mock('ethers', () => ({
  ethers: {
    utils: {
      isAddress: jest.fn(),
      parseEther: jest.fn(),
    },
    BigNumber: {
      from: jest.fn()
    }
  }
}))

// Mock Chakra toast
const mockToast = jest.fn()
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react')
  return {
    ...actual,
    useToast: () => mockToast
  }
})

describe('TransferModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onTransferSuccess: jest.fn(),
    address: '0x123',
    balance: '1.0'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mocked functions to their default behavior
    ;(ethers.utils.isAddress as jest.Mock).mockReturnValue(true)
    ;(ethers.utils.parseEther as jest.Mock).mockImplementation(() => ({
      lte: jest.fn().mockReturnValue(false),
      gt: jest.fn().mockReturnValue(false)
    }))
    ;(sendTransaction as jest.Mock).mockResolvedValue({ wait: jest.fn() })
  })

  it('renders nothing when address is null', () => {
    const { container } = render(
      <TransferModal {...defaultProps} address={null} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders modal with correct form elements when open', () => {
    render(<TransferModal {...defaultProps} />)
    expect(screen.getByText('Transfer ETH')).toBeInTheDocument()
    expect(screen.getByLabelText(/Recipient Address:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Amount \(ETH\):/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
  })

  describe('Form Validation', () => {
    it('validates invalid ethereum address', async () => {
      ;(ethers.utils.isAddress as jest.Mock).mockReturnValue(false)
      
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0xinvalid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '0.1')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      expect(await screen.findByText('Invalid Ethereum address.')).toBeInTheDocument()
    })

    it('validates amount greater than balance', async () => {
      ;(ethers.utils.parseEther as jest.Mock).mockImplementation(() => ({
        lte: jest.fn().mockReturnValue(false),
        gt: jest.fn().mockReturnValue(true)
      }))
      
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0x123valid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '2.0')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      expect(await screen.findByText('Insufficient balance.')).toBeInTheDocument()
    })

    it('validates amount less than or equal to zero', async () => {
      ;(ethers.utils.parseEther as jest.Mock).mockImplementation(() => ({
        lte: jest.fn().mockReturnValue(true),
        gt: jest.fn().mockReturnValue(false)
      }))
      
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0x123valid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '0')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      expect(await screen.findByText('Amount must be greater than 0.')).toBeInTheDocument()
    })
  })

  describe('Transaction Handling', () => {
    it('handles successful transaction', async () => {
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0x123valid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '0.1')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      await waitFor(() => {
        expect(sendTransaction).toHaveBeenCalledWith('0x123valid', '0.1')
        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
          status: 'success',
          title: 'Transaction Sent'
        }))
        expect(defaultProps.onTransferSuccess).toHaveBeenCalled()
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('handles failed transaction', async () => {
      const mockError = new Error('Transaction failed')
      ;(sendTransaction as jest.Mock).mockRejectedValue(mockError)
      
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0x123valid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '0.1')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
          status: 'error',
          title: 'Transaction Failed'
        }))
        expect(screen.getByText('Transaction failed. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Behavior', () => {
    it('resets form on close', async () => {
      render(<TransferModal {...defaultProps} />)
      
      const recipientInput = screen.getByTestId('recipient')
      const amountInput = screen.getByTestId('amount')
      
      await userEvent.type(recipientInput, '0x123valid')
      await userEvent.type(amountInput, '0.1')
      
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))
      
      expect(recipientInput).toHaveValue('')
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('shows loading state during transaction', async () => {
      const mockTransaction = new Promise(resolve => setTimeout(resolve, 100))
      ;(sendTransaction as jest.Mock).mockReturnValue({ wait: () => mockTransaction })
      
      render(<TransferModal {...defaultProps} />)
      
      await userEvent.type(screen.getByLabelText(/Recipient Address:/), '0x123valid')
      await userEvent.type(screen.getByLabelText(/Amount \(ETH\):/), '0.1')
      
      fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
      
      expect(screen.getByRole('button', { name: /Send/i })).toHaveAttribute('disabled')
      expect(screen.getByRole('button', { name: /Send/i })).toHaveAttribute('data-loading')
    })
  })
})