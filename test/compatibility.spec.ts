import axios from 'axios';

describe('GraphQL server', () => {
    it('returns OK for block', async () => {
        var response = await axios.post('http://localhost:3000/graphql', {
            query: `{
                block(block: "head")
                {
                    transactions {
                        source
                        destination
                        amount
                    }
                }
            }`
        });

        expect(response.status).toBe(200);
    });
});