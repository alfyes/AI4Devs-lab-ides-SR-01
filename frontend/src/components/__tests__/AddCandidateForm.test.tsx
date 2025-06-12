import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCandidateForm from '../AddCandidateForm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AddCandidateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<AddCandidateForm />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/educación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experiencia laboral/i)).toBeInTheDocument();
    expect(screen.getByText(/subir cv/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AddCandidateForm />);
    
    const submitButton = screen.getByText(/guardar candidato/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<AddCandidateForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText(/guardar candidato/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('handles file upload', async () => {
    render(<AddCandidateForm />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/subir cv/i);
    
    await userEvent.upload(fileInput, file);
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true, id: '123' } });
    
    render(<AddCandidateForm />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByText(/guardar candidato/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3010/api/candidates',
        expect.any(FormData),
        expect.any(Object)
      );
      expect(screen.getByText(/candidato añadido exitosamente/i)).toBeInTheDocument();
    });
  });

  it('handles submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    
    render(<AddCandidateForm />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByText(/guardar candidato/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error al crear el candidato/i)).toBeInTheDocument();
    });
  });
}); 