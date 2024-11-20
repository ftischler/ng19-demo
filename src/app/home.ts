import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  REQUEST,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HelloDto } from '../models/helloDto';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    This part is rendered on the server
    @if (helloResource.isLoading()) {
      <p>Loading...</p>
    }
    @if (helloResource.value(); as hello) {
      <pre>{{ hello | json }}</pre>
    }
    <pre>{{ request | json }}</pre>
  `,
  selector: 'home',
  imports: [JsonPipe],
})
export default class Home {
  name = input<string>();

  request = inject(REQUEST);
  httpClient = inject(HttpClient);

  helloResource = rxResource({
    request: () => this.name,
    loader: ({ request }) => {
      const name = request();
      return this.httpClient.get<HelloDto>(
        '/api/hello',
        name ? { params: { name } } : {},
      );
    },
  });
}
