import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

describe('POST /api/candidates', () => {
  beforeEach(async () => {
    await prisma.candidate.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: '123 Main St',
      education: 'Bachelor in Computer Science',
      experience: '5 years of experience',
    };

    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', candidateData.firstName)
      .field('lastName', candidateData.lastName)
      .field('email', candidateData.email)
      .field('phone', candidateData.phone)
      .field('address', candidateData.address)
      .field('education', candidateData.education)
      .field('experience', candidateData.experience)
      .attach('cv', path.join(__dirname, '../tests/fixtures/sample-cv.pdf'));

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('id');

    const createdCandidate = await prisma.candidate.findUnique({
      where: { id: response.body.id },
    });

    expect(createdCandidate).toBeTruthy();
    expect(createdCandidate?.email).toBe(candidateData.email);
  });

  it('should return 400 for invalid data', async () => {
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
    };

    const response = await request(app)
      .post('/api/candidates')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });
}); 