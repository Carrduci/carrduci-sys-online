import { Component, Input } from '@angular/core'

@Component({
	selector: 'csys-logo-carrduci-svg',
	templateUrl: './logo-carrduci-svg.component.html',
	styleUrls: ['./logo-carrduci-svg.component.scss'],
	standalone: true,
})
export class LogoCarrduciSvgComponent {
	@Input() width: string = '250px'
	@Input() height: string = '250px'
}
