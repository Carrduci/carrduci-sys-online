import { TestBed } from '@angular/core/testing'

import { ControlDeFlotantesService } from './control-de-flotantes.service'

describe('ControlDeFlotantesService', () => {
	let service: ControlDeFlotantesService

	beforeEach(() => {
		TestBed.configureTestingModule({})
		service = TestBed.inject(ControlDeFlotantesService)
	})

	it('should be created', () => {
		expect(service).toBeTruthy()
	})
})
