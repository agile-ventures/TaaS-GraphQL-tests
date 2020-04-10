import { testQuery, blockFields, testBlocksQuery } from './queries';
import { union } from 'lodash';
import { AxiosResponse } from 'axios';

describe('GraphQL server query', () => {
    beforeEach(() => {
        // 60s timeout for each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
    });

    function expectUniqueBlockHashesIn(response: AxiosResponse) {
        return expect(union((<any[]>response.data.data.blocks).map(b => b.hash)).length);
    }

    async function itReturnsBlockCount(queryArguments: string, expectedBlockCount: number) {
        it(queryArguments, async () => {
            var response = await testBlocksQuery(queryArguments);
            expect(response.data.data.blocks.length).toBe(expectedBlockCount);
            expectUniqueBlockHashesIn(response).toBe(expectedBlockCount);
        });
    }

    describe('fetching blocks', () => {
        itReturnsBlockCount('from: "head~4"', 5);
        itReturnsBlockCount('count: 5', 5);
        itReturnsBlockCount('from: "head~14", to: "head~10"', 5);
        itReturnsBlockCount('to: "head~10", count: 5', 5);
        itReturnsBlockCount('from: "BKmkM6MrPSzG6Y97UjRopWWBafJFYgKXby3e18inY4gdPY1KB7b", count: 5', 5);
        itReturnsBlockCount('to: "BKmkM6MrPSzG6Y97UjRopWWBafJFYgKXby3e18inY4gdPY1KB7b", count: 5', 5);
        itReturnsBlockCount('from: "895970", count: 5', 5);
        itReturnsBlockCount('to: "895970", count: 5', 5);
    });
});
