import { Controller, Post, Body, Get, Param, Req, Res, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Post('shorten')
    async shortenUrl(@Body('url') longUrl: string, @Req() request: Request) {
        const shortCode = await this.urlService.shortenUrl(longUrl);
        const host = request.get('host');
        const shortUrl = `http://${host}/url/${shortCode}`;
        return { shortUrl };
    }

    @Get(':code')
    async redirectToLongUrl(@Param('code') code: string, @Res() res: Response) {
        const longUrl = await this.urlService.getLongUrl(code);
        if (!longUrl) {
            throw new NotFoundException('URL not found');
        }
        return res.redirect(longUrl);
    }
}
