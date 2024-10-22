import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import TopBar from '../../components/TopBar'
 
describe('TopBar', () => {
  it('renders a heading', () => {
    render(<TopBar><></></TopBar>)
 
    const heading = screen.getByTestId('header-test')
    expect(heading).toHaveTextContent('Wallet Transfer')
   })

   it('renders the logo image with correct attributes', () => {
    render(<TopBar><></></TopBar>)
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/icon.png')
    expect(logo.tagName).toBe('IMG')
  })

  it('renders children content correctly', () => {
    const childContent = <div data-testid="child-content">Test Child</div>
    render(<TopBar>{childContent}</TopBar>)
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toHaveTextContent('Test Child')
  })

  it('heading has correct styling classes for responsive display', () => {
    render(<TopBar><></></TopBar>)
    const heading = screen.getByTestId('header-test')
    expect(heading).toHaveStyle({
      fontWeight: 'bold',
      fontSize: 'xl'
    })
  })

  it('maintains structure with multiple children', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    )
    render(<TopBar>{multipleChildren}</TopBar>)
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })
})