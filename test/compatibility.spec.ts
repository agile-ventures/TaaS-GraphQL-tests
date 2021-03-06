import { bigMaps, constantsField, contractField, delegateField, testBlock, delegateWithBakingRightsField } from './queries';

describe('GraphQL server compatibility layer', () => {
    beforeEach(() => {
        // 60s timeout for each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
    });

    function itReturnsOkForBlock(block: any, description: string, additionalBlockFields: string[] = []) {
        it(`returns OK for ${block} (${description})`, async () => testBlock(block, additionalBlockFields));
    }

    describe('on recent data', () => {
        itReturnsOkForBlock('head', 'latest protocol', [contractField, delegateField, bigMaps]);
        itReturnsOkForBlock(896621, '006', [contractField, delegateField, bigMaps]);
    });

    describe('on starting blocks', () => {
        itReturnsOkForBlock(851969, '006');
        itReturnsOkForBlock(655361, '005');
        itReturnsOkForBlock(458753, '004');
        itReturnsOkForBlock(204762, '003');
        itReturnsOkForBlock(28083, '002');
        itReturnsOkForBlock(2, '001');
    });

    xdescribe('on starting blocks', () => {
        itReturnsOkForBlock(1, '000');
        itReturnsOkForBlock(0, 'Genesis');
    });

    describe('on operation sample', () => {
        itReturnsOkForBlock(907464, '006', [delegateWithBakingRightsField]);
        itReturnsOkForBlock(907471, '006', [bigMaps, delegateWithBakingRightsField]);
        itReturnsOkForBlock(896065, '006', [contractField, delegateField]);
        itReturnsOkForBlock(767840, '005', [bigMaps]);
        itReturnsOkForBlock(696617, '005', [contractField, delegateField]);
        itReturnsOkForBlock(554813, '004', [contractField, delegateField]);
        itReturnsOkForBlock(32959, '002', [contractField]);
        itReturnsOkForBlock(3425, '001', [contractField]);
        itReturnsOkForBlock(446, '001');
        itReturnsOkForBlock(379, '001');
    });

    describe('on constants', () => {
        itReturnsOkForBlock(896065, '005', [constantsField]);
        itReturnsOkForBlock(700000, '005', [constantsField]);
    });
});
