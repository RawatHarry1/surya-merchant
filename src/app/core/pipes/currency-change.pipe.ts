import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrToUsd',
  standalone: true
})
export class CurrencyChangePipe implements PipeTransform {

  transform(value: number, conversionRate: number = 1, symbol: string = '$'): string {
    if (!value) {
      return `${symbol}0.00`;
    }
  
    // Convert INR to USD using the conversion rate
    const convertedAmount = value * conversionRate;
  
    // Format the result with commas and two decimal points
    const formattedAmount = convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    // Return the result with USD symbol
    return `${symbol}${formattedAmount}`;
  }
  

}
