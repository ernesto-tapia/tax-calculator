import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

describe('Home', () => {
  const renderComponent = () => {
    return render(<HomePage />);
  };

  it('renders a combobox, a spinbutton and a button, the button gets disabled if the spinbutton is not a number, or a negative number', async () => {
    const user = userEvent.setup();
    renderComponent();
    const spinbutton = screen.getByRole('spinbutton');
    const button = screen.getByRole('button');
    const combobox = screen.getByRole('combobox');
    expect(button).toBeInTheDocument();
    expect(spinbutton).toBeInTheDocument();
    expect(combobox).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    await user.type(spinbutton, 'e');
    expect(button).toBeDisabled();
    await user.clear(spinbutton);
    await user.type(spinbutton, '-100');
    expect(button).toBeDisabled();
    await user.click(combobox);
    const listBox = screen.getByRole('listbox');
    const listItem = within(listBox).getByText('2020');
    await user.click(listItem);
    await user.clear(spinbutton);
    await user.type(spinbutton, '200');
    expect(button).not.toBeDisabled();
  });

  it('triggers an api cal when submit is pressed', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            tax_brackets: [
              {
                max: 47630,
                min: 0,
                rate: 0.15,
              },
              {
                max: 95259,
                min: 47630,
                rate: 0.205,
              },
              {
                max: 147667,
                min: 95259,
                rate: 0.26,
              },
              {
                max: 210371,
                min: 147667,
                rate: 0.29,
              },
              {
                min: 210371,
                rate: 0.33,
              },
            ],
          }),
      })
    ) as jest.Mock;
    renderComponent();
    const spinbutton = screen.getByRole('spinbutton');
    fireEvent.change(spinbutton, { target: { value: '1234567' } });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalled();
    const skeleton = await screen.findByTestId('loader');
    expect(skeleton).toBeInTheDocument();
    await waitForElementToBeRemoved(skeleton);
    const resultBox = await screen.findByTestId('result-text');
    expect(resultBox).toBeInTheDocument();
    const { getByText } = within(resultBox);
    expect(getByText('Total Taxes: $386,703.37')).toBeInTheDocument();
    fireEvent.change(spinbutton, { target: { value: '23456' } });
    fireEvent.click(button);
    await waitForElementToBeRemoved(await screen.findByTestId('loader'));
    expect(
      await screen.findByText('Total Taxes: $3,518.40')
    ).toBeInTheDocument();
  });

  it('displays error message when api call fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 500, statusCode: '500 INTERNAL SERVER ERROR' })
    ) as jest.Mock;
    renderComponent();
    const spinbutton = screen.getByRole('spinbutton');
    fireEvent.change(spinbutton, { target: { value: '1234' } });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalled();
    const skeleton = await screen.findByTestId('loader');
    expect(skeleton).toBeInTheDocument();
    await waitForElementToBeRemoved(skeleton);
    const resultBox = await screen.findByTestId('result-text');
    expect(resultBox).toBeInTheDocument();
  });
});
