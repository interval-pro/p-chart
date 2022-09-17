import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class BinanceApiService {
    constructor(
        private http: HttpClient,
    ) {}

    async getCandlesData(symbol: string, interval: string, firstCandleTime: number = 0) {
        let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`;
        if (firstCandleTime) url += `&endTime=${firstCandleTime - 1}`;
        const subs$ = this.http.get(url);
        return await firstValueFrom<any>(subs$);
    }
}
