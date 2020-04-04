import axios from 'axios';

const blockQuery = `
{
    protocol
    chain_id
    hash
    header { ... blockFullHeader }
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
        balance_updates { ... balanceUpdates }
    }
    operations {
        protocol
        chain_id
        hash
        branch
        contents {
            kind
            operation { ... operationInfo }
        }
        signature
    }
    activations {
        kind
        pkh
        secret
        metadata {
            balance_updates { ... operationMetadataBalanceUpdates }
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
            balance_updates { ... operationMetadataBalanceUpdates }
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
    double_baking_evidence {
        kind
        bh1 { ... blockFullHeader }
        bh2 { ... blockFullHeader }
        metadata {
            balance_updates { ... operationMetadataBalanceUpdates }
        }
        operation { ... operationInfo }
    }
    double_endorsement_evidence {
        kind
        op1 { ... inlinedEndorsement }
        op2 { ... inlinedEndorsement }
        metadata {
            balance_updates { ... operationMetadataBalanceUpdates }
        }
        operation { ... operationInfo }
    }
    endorsements {
        kind
        level
        metadata {
            balance_updates { ... operationMetadataBalanceUpdates }
            delegate
            slots
        }
        operation { ... operationInfo }
    }
    originations {
        kind
        source
        fee
        counter
        gas_limit
        storage_limit
        balance
        delegate
        script {
            code { ... michelsonExpr }
            storage { ... michelsonExpr }
        }
        metadata {
            balance_updates { ... operationMetadataBalanceUpdates }
            operation_result { ... operationResultOrigination }
            internal_operation_results {
                kind
                info {
                    source
                    nonce
                    amount
                    destination
                    parameters {
                        # TODO fragment
                        entrypoint
                        value { ... michelsonExpr }
                    }
                    public_key
                    balance
                    delegate
                    script {
                        # TODO fragment
                        code { ... michelsonExpr }
                        storage { ... michelsonExpr }
                    }
                }
                result { ... operationResultOrigination }
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

fragment blockFullHeader on BlockFullHeader {
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

fragment operationMetadataBalanceUpdates on OperationMetadataBalanceUpdates {
    kind
    category
    contract
    delegate
    cycle
    change
}

fragment balanceUpdates on OperationBalanceUpdates {
    kind
    category
    contract
    delegate
    cycle
    change
}

fragment inlinedEndorsement on InlinedEndorsement {
    branch
    operations {
        kind
        level
        operation { ... operationInfo }
    }
    signature
}

fragment operationResultOrigination on OperationResultOrigination {
    status
    consumed_gas
    errors {
        kind
        id
    }
    balance_updates  { ... balanceUpdates }
    originated_contracts
    storage_size
    paid_storage_size_diff
}`;

describe('GraphQL server', () => {
    beforeEach(() => {
        // 60s timeout for each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
    });

    it('returns OK for block', async () => {
        var response = await axios.post('http://localhost:3000/graphql', {
            query: `{ block(block: "head") ${blockQuery} } ${fragments}`
        }, { validateStatus: () => true });

        if (response.status != 200) {
            fail(`Returned ${response.status} ${response.statusText}`)
        }

        expect(response.data.errors).toBeUndefined();
        if (response.data.errors) {
            console.debug(response.data.errors);
        }
    });
});