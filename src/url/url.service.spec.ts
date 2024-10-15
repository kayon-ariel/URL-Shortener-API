import { UrlService } from './url.service';

jest.mock('uuid', () => ({
    v4: jest.fn(() => '12345678-1234-1234-1234-123456789012'),
}));

describe('UrlService', () => {
    let urlService: UrlService;
    let mockPrismaService: any;

    beforeEach(() => {
        mockPrismaService = {
            url: {
                create: jest.fn(),
            },
        };

        urlService = new UrlService(mockPrismaService);
    });

    describe('shortenUrl', () => {
        it('should shorten a URL and store it in memory and database', async () => {
            const longUrl = 'http://example.com/some/long/url';
            const shortCode = '123456';

            mockPrismaService.url.create.mockResolvedValue({
                shortCode,
                longUrl,
            });

            const result = await urlService.shortenUrl(longUrl);

            expect(result).toBe(shortCode);
            expect(urlService['urlStore'].get(shortCode)).toBe(longUrl);
            expect(mockPrismaService.url.create).toHaveBeenCalledWith({
                data: {
                    shortCode,
                    longUrl,
                },
            });
        });
    });

    describe('getLongUrl', () => {
        it('should return the long URL for a given short code', async () => {
            const longUrl = 'http://example.com/some/long/url';
            const shortCode = '123456';
            
            urlService['urlStore'].set(shortCode, longUrl);

            const result = await urlService.getLongUrl(shortCode);

            expect(result).toBe(longUrl);
        });

        it('should return undefined for a non-existent short code', async () => {
            const result = await urlService.getLongUrl('nonexistent');

            expect(result).toBeUndefined();
        });
    });
});
