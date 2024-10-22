import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TransferButton from '../../components/TransferButton'

// Mock the TransferModal component
jest.mock('../../components/TransferModal', () => {
  return jest.fn(({ isOpen, onClose, address, balance, onTransferSuccess }) => (
    isOpen ? (
      <div data-testid="mock-modal">
        <span>Address: {address}</span>
        <span>Balance: {balance}</span>
        <button onClick={onClose}>Close</button>
        <button onClick={onTransferSuccess}>Success</button>
      </div>
    ) : null
  ))
})

describe('TransferButton', () => {
  const mockAddress = '0x123'
  const mockBalance = '1.5'
  const mockOnTransferSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when address is null', () => {
    const { container } = render(
      <TransferButton
        address={null}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the send ETH button when address is provided', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    const button = screen.getByText('Send ETH')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('opens modal when button is clicked', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument()
    
    // Click button and check if modal appears
    fireEvent.click(screen.getByText('Send ETH'))
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument()
  })

  it('closes modal when onClose is triggered', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    
    // Open modal
    fireEvent.click(screen.getByText('Send ETH'))
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument()
  })

  it('passes correct props to TransferModal', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    
    // Open modal
    fireEvent.click(screen.getByText('Send ETH'))
    
    // Check if props are passed correctly
    expect(screen.getByText(`Address: ${mockAddress}`)).toBeInTheDocument()
    expect(screen.getByText(`Balance: ${mockBalance}`)).toBeInTheDocument()
  })

  it('triggers onTransferSuccess callback', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    
    // Open modal
    fireEvent.click(screen.getByText('Send ETH'))
    
    // Trigger success
    fireEvent.click(screen.getByText('Success'))
    expect(mockOnTransferSuccess).toHaveBeenCalledTimes(1)
  })

  it('maintains modal state correctly through multiple opens and closes', () => {
    render(
      <TransferButton
        address={mockAddress}
        balance={mockBalance}
        onTransferSuccess={mockOnTransferSuccess}
      />
    )
    
    // First cycle
    fireEvent.click(screen.getByText('Send ETH'))
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument()
    
    // Second cycle
    fireEvent.click(screen.getByText('Send ETH'))
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument()
  })
})