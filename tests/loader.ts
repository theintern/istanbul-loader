import * as sinon from 'sinon';
import * as mockery from 'mockery';

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
	let sandbox: sinon.SinonSandbox;

	before(() => {
		sandbox = sinon.sandbox.create();
		instrumentMock = sandbox.stub().callsArg(2);
		sourceMapMock = sandbox.stub().returns({});
		mockery.registerMock('istanbul-lib-instrument', {
			createInstrumenter: sandbox.stub().returns({
				instrument: instrumentMock,
				lastSourceMap: sourceMapMock
			})
		});
		loaderUnderTest = require('src/loader').default;
	});

	after(() => {
		mockery.deregisterMock('istanbul-lib-instrument');
	});

	afterEach(() => {
		sandbox.reset();
	});

	it('should call istanbul to instrument files', () => {
		return new Promise(resolve => {
			loaderUnderTest.call(
				{
					async() {
						return () => resolve();
					}
				},
				'content',
				getSourceMap()
			);
		}).then(() => {
			assert.isTrue(instrumentMock.calledOnce);
		});
	});

	it('handles no source map', () => {
		return new Promise(resolve => {
			loaderUnderTest.call(
				{
					async() {
						return () => resolve();
					}
				},
				'content',
				null
			);
		}).then(() => {
			assert.isTrue(instrumentMock.calledOnce);
		});
	});

	it('handles a source map with no sources', () => {
		return new Promise(resolve => {
			loaderUnderTest.call(
				{
					async() {
						return () => resolve();
					}
				},
				'content',
				{}
			);
		}).then(() => {
			assert.isTrue(instrumentMock.calledOnce);
		});
	});

	it('should fix source maps', () => {
		let sourceMap = getSourceMap();

		sourceMapMock.reset();
		sourceMapMock.returns(sourceMap);

		return new Promise(resolve => {
			loaderUnderTest.call(
				{
					async() {
						return () => resolve();
					}
				},
				'content',
				sourceMap
			);
		}).then(() => {
			assert.deepEqual(sourceMap.sources, ['myFile.ts', 'myFile2.ts']);
		});
	});
});
