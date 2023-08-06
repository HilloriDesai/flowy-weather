import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CurrentWeather from '../components';
import axios from 'axios';

jest.mock('axios'); // Mock axios to avoid actual API calls during tests

describe('CurrentWeather', () => {
  test('renders CurrentWeather component', () => {
    render(<CurrentWeather />);
    expect(screen.getByText('Flowy Weather App')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter City Name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Weather' })).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    render(<CurrentWeather />);
    const input = screen.getByPlaceholderText('Enter City Name...');
    fireEvent.change(input, { target: { value: 'New York' } });
    expect(input.value).toBe('New York');
  });

  test('fetches weather data and displays it', async () => {
    const mockWeatherData = {
    main: { temp: 25, humidity: 80 },
    weather: [{ description: 'Sunny' }],
    wind: { speed: 10 },
  };

  axios.get.mockResolvedValue({ data: mockWeatherData });

  render(<CurrentWeather />);
  const input = screen.getByPlaceholderText('Enter City Name...');
  const button = screen.getByRole('button', { name: 'Get Weather' });

  fireEvent.change(input, { target: { value: 'New York' } });
  fireEvent.click(button);

  // Custom text matcher function to find the temperature text
  const customTextMatcher = (content, element) => {
    const hasText = (el) => el.textContent === content;
    const childrenDontHaveText = Array.from(element.children).every(
      (child) => !hasText(child)
    );
    return hasText(element) && childrenDontHaveText;
  };

  await waitFor(() => {
    // Use the custom text matcher with getByText
    expect(screen.getByText('New York Weather', { matcher: customTextMatcher })).toBeInTheDocument();
    expect(screen.getByText('Temperature:', { matcher: customTextMatcher })).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/, { matcher: customTextMatcher })).toBeInTheDocument();
    expect(screen.getByText(/Wind:/, { matcher: customTextMatcher })).toBeInTheDocument();
  });
  });

  test('displays error message on invalid city name', async () => {
    render(<CurrentWeather />);
    const button = screen.getByRole('button', { name: 'Get Weather' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid location.')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue({});

    render(<CurrentWeather />);
    const input = screen.getByPlaceholderText('Enter City Name...');
    const button = screen.getByRole('button', { name: 'Get Weather' });

    fireEvent.change(input, { target: { value: 'New York' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch weather data. Please make sure that the city name is correct.')).toBeInTheDocument();
    });
  });
});

const server = setupServer(
  rest.get('/api/weather', (req, res, ctx) => {
    const { location } = req.url.searchParams;
    if (location === 'New York') {
      return res(
        ctx.json({
          main: { temp: 25, humidity: 80 },
          weather: [{ description: 'Sunny' }],
          wind: { speed: 10 },
        })
      );
    } else {
      return res(ctx.status(400), ctx.json({ message: 'Invalid location' }));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Weather App Integration Test', () => {
  test('fetches and displays weather data', async () => {
    render(<CurrentWeather />);
    const input = screen.getByPlaceholderText('Enter City Name...');
    const button = screen.getByRole('button', { name: 'Get Weather' });
  
    fireEvent.change(input, { target: { value: 'New York' } });
    fireEvent.click(button);
  
    // Custom text matcher function to find the temperature text
    const customTextMatcher = (content, element) => {
      const hasText = (el) => el.textContent === content;
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return hasText(element) && childrenDontHaveText;
    };
    setTimeout(
      waitFor(() => {
        // Use the custom text matcher with getByText
        expect(screen.getByText('New York Weather', { matcher: customTextMatcher })).toBeInTheDocument();
        expect(screen.getByText('Temperature:', { matcher: customTextMatcher })).toBeInTheDocument();
        expect(screen.getByText(/Humidity:/, { matcher: customTextMatcher })).toBeInTheDocument();
        expect(screen.getByText(/Wind:/, { matcher: customTextMatcher })).toBeInTheDocument();
      })
      , 1000
    )
  });


  test('displays error message on invalid city name', async () => {
    render(<CurrentWeather />);

    const button = screen.getByRole('button', { name: 'Get Weather' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid location.')).toBeInTheDocument();
    });
  });
});