import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LogoCarrduciSvgComponent } from './logo-carrduci-svg.component'

describe('LogoCarrduciSvgComponent', () => {
	let component: LogoCarrduciSvgComponent
	let fixture: ComponentFixture<LogoCarrduciSvgComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogoCarrduciSvgComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(LogoCarrduciSvgComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
