import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

const socketBaseUrl = 'wss://stream.binance.com:9443/ws/';

@Injectable({
    providedIn: 'root',
})

export class BinanceApiService {
    constructor(
        private http: HttpClient,
    ) {}

    getCnadlesSocketData(symbol: string, interval: string) {
        const _symbol = symbol.toLowerCase();
        const url = `${socketBaseUrl}${_symbol}@kline_${interval}`;
        return new WebSocket(url);
    }

    async getCandlesData(symbol: string, interval: string, firstCandleTime: number = 0) {
        let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`;
        if (firstCandleTime) url += `&endTime=${firstCandleTime - 1}`;
        const subs$ = this.http.get(url);
        return await firstValueFrom<any>(subs$);
    }
}
