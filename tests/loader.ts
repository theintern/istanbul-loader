import { SinonSandbox, sandbox as Sandbox } from 'sinon';
import {
	disable as disableMockery,
	enable as enableMockery,
	registerAllowable,
	registerMock,
	deregisterMock
} from 'mockery';

const { after, afterEach, before, describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

function getSourceMap() {
	return {
		sources: ['some/path!myFile.ts', 'myFile2.ts']
	};
}

describe('istanbul-loader', () => {
	let loaderUnderTest: any;
	let instrumentMock: any;
	let sourceMapMock: any;
	let sandbox: SinonSandbox;

	before(() => {
		sandbox = Sandbox.create();
		instrumentMock = sandbox.stub().callsArg(2);
		sourceMapMock = sandbox.stub().returns({});

		enableMockery({ useCleanCache: true });
		registerMock('istanbul-lib-instrument', {
			createInstrumenter() {
				return {
					instrument: instrumentMock,
					lastSourceMap: sourceMapMock
				};
			}
		});
		registerAllowable('src/index');
		loaderUnderTest = require('src/index').default;
	});

	after(() => {
		deregisterMock('istanbul-lib-instrument');
		disableMockery();
	});

	afterEach(() => {
		sandbox.resetHistory();
	});

	it('should call istanbul to instrument files', () => {
		return new Promise(resolve => {
			loaderUnderTest.call(
				{ async: () => resolve },
				'content',
				getSourceMap()
			);
		}).then(() => {
			assert.equal(instrumentMock.callCount, 1);
		});
	});

	it('handles no source map', () => {
		return new Promise(resolve => {
			loaderUnderTest.call({ async: () => resolve }, 'content', null);
		}).then(() => {
			assert.equal(instrumentMock.callCount, 1);
		});
	});

	it('handles a source map with no sources', () => {
		return new Promise(resolve => {
			loaderUnderTest.call({ async: () => resolve }, 'content', {});
		}).then(() => {
			assert.equal(instrumentMock.callCount, 1);
		});
	});

	it('should fix source maps', () => {
		let sourceMap = getSourceMap();

		sourceMapMock.reset();
		sourceMapMock.returns(sourceMap);

		return new Promise(resolve => {
			loaderUnderTest.call(
				{ async: () => resolve },
				'content',
				sourceMap
			);
		}).then(() => {
			assert.deepEqual(sourceMap.sources, ['myFile.ts', 'myFile2.ts']);
		});
	});
});
