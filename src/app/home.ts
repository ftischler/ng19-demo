import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  REQUEST,
  resource,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HelloDto } from '../models/helloDto';

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

  helloResource = resource({
    request: () => this.name,
    loader: async ({ request, abortSignal }) => {
      const name = request();
      const params = name ? `?name=${name}` : '';
      const res = await fetch(`/api/hello${params}`, { signal: abortSignal });
      return (await res.json()) as HelloDto;
    },
  });
}
