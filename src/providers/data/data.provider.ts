import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IQuote} from "./data.interface";

@Injectable()
export class DataProvider {

  quotesUrl = "assets/data/quotes.txt";

  constructor(public http: HttpClient) {
  }

  getQuotes(): Promise<IQuote[]> {
    return this.http.get(this.quotesUrl, {responseType: 'text'})
      .map(res => res.split('\n')
        .filter(line => line.length > 0)
        .map(line => {
          let arr = line.split(";;");
          return {
            id: parseInt(arr[0]),
            text: arr[1],
            category: arr[2],
            author: arr[3]
          };
        }))
      .toPromise();
  }

  filterQuotes(searchTerm): Promise<IQuote[]> {
    return new Promise((resolve, reject) => {
      this.getQuotes()
        .then(quotes => {
          let filteredQuotes = quotes.filter((quote: IQuote) => {
            return quote.text.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
              quote.category.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
              quote.author.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
          resolve(filteredQuotes);
        })
        .catch(reject);
    })
  }

}
