import axios from 'axios';

const blockQuery = `
{
    protocol
    chain_id
    hash
    header {
        level
        proto
        predecessor
        timestamp
        validation_pass
        operations_hash
        fitness
        context
        priority
        proof_of_work_nonce
        seed_nonce_hash
        signature
    }
    metadata {
        protocol
        next_protocol
        test_chain_status {
            status
        }
        max_operations_ttl
        max_operation_data_length
        max_block_header_length
        max_operation_list_length {
            max_size
            max_op
        }
        baker
        level {
            level
            level_position
            cycle
            cycle_position
            voting_period
            voting_period_position
            expected_commitment
        }
        voting_period_kind
        consumed_gas
        balance_updates {
            kind
            category
            delegate
            cycle
            contract
            change
        }
    }
    operations {
        protocol
        chain_id
        hash
        branch
        contents {
            kind
            operation {
                protocol
                chain_id
                hash
                branch
                signature
            }
        }
        signature
    }
    activations {
        kind
        pkh
        secret
        metadata {
            balance_updates {
                kind
                category
                contract
                delegate
                cycle
                change
            }
        }
        parent { ... operationInfo }
        operation { ... operationInfo }
    }
    ballots {
        kind
        source
        period
        proposal
        ballot
        operation { ... operationInfo }
    }
    delegations {
        kind
        source
        fee
        counter
        gas_limit
        storage_limit
        delegate
        metadata {
            balance_updates {
                kind
                category
                contract
                delegate
                cycle
                change
            }
            operation_result {
                status
                consumed_gas
                errors {
                    kind
                    id
                }
            }
            internal_operation_results {
                kind
                info {
                    source
                    nonce
                    amount
                    destination
                    parameters {
                        entrypoint
                        value { ... michelsonExpr }
                    }
                    public_key
                    balance
                    delegate
                    script {
                        code { ... michelsonExpr }
                        storage { ... michelsonExpr }
                    }
                }
                result {
                    status
                    consumed_gas
                    errors {
                        kind
                        id
                    }
                }
            }
        }
        operation { ... operationInfo }
    }
}`;

const fragments = `
fragment michelsonExpr on MichelsonV1Expression {
    ... on MichelsonV1ExpressionBase {
        int
        String
        bytes
    }
    ... on MichelsonV1ExpressionExtended {
        prim
        annots
        # skip args to avoid exceeding max depth
    }
}

fragment operationInfo on OperationEntry {
    protocol
    chain_id
    hash
    branch
    signature
}
`;

describe('GraphQL server', () => {
    beforeEach(() => {
        // 60s timeout for each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
    });

    it('returns OK for block', async () => {
        var response = await axios.post('http://localhost:3000/graphql', {
            query: `{ block(block: "head") ${blockQuery} } ${fragments}`
        });

        expect(response.status).toBe(200);
        expect(response.data.errors).toBeUndefined();
        if (response.data.errors) {
            console.debug(response.data.errors);
        }
    });
});