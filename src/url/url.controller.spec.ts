import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

describe('UrlController', () => {
    let urlController: UrlController;
    let urlService: UrlService;

    const mockUrlService = {
        shortenUrl: jest.fn(),
        getLongUrl: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                {
                    provide: UrlService,
                    useValue: mockUrlService,
                },
            ],
        }).compile();

        urlController = module.get<UrlController>(UrlController);
        urlService = module.get<UrlService>(UrlService);
    });

    describe('shortenUrl', () => {
        it('should shorten the URL and return the short URL', async () => {
            const longUrl = 'http://example.com/some/long/url';
            const shortCode = 'abc123';
            const req = { get: jest.fn().mockReturnValue('localhost:3000') };

            mockUrlService.shortenUrl.mockResolvedValue(shortCode);

            const result = await urlController.shortenUrl(longUrl, req as any);
            expect(result).toEqual({ shortUrl: `http://localhost:3000/url/${shortCode}` });
            expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(longUrl);
        });
    });

    describe('redirectToLongUrl', () => {
        it('should redirect to the long URL', async () => {
            const shortCode = 'abc123';
            const longUrl = 'http://example.com/some/long/url';
            const res = {
                redirect: jest.fn(),
            };

            mockUrlService.getLongUrl.mockResolvedValue(longUrl);

            await urlController.redirectToLongUrl(shortCode, res as any);
            expect(res.redirect).toHaveBeenCalledWith(longUrl);
            expect(mockUrlService.getLongUrl).toHaveBeenCalledWith(shortCode);
        });

        it('should throw NotFoundException if the long URL is not found', async () => {
            const shortCode = 'nonexistent';
            const res = {
                redirect: jest.fn(),
            };

            mockUrlService.getLongUrl.mockResolvedValue(null);

            await expect(urlController.redirectToLongUrl(shortCode, res as any))
                .rejects
                .toThrow(NotFoundException);
            expect(mockUrlService.getLongUrl).toHaveBeenCalledWith(shortCode);
        });
    });
});
