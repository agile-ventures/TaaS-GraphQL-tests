import axios, { AxiosResponse } from 'axios';
import { stringify } from 'querystring';

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
                    parameters { ... parameters }
                    public_key
                    balance
                    delegate
                    script { ... scriptedContract }
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
                    parameters { ... parameters }
                    public_key
                    balance
                    delegate
                    script { ... scriptedContract }
                }
                result { ... operationResultOrigination }
            }
        }
        operation { ... operationInfo }
    }
    proposals { # [OperationContentsProposal]!
        kind
        source
        period
        proposals
        operation { ... operationInfo }
    }
    reveals { # [OperationContentsReveal]!
        kind
        source
        fee
        counter
        gas_limit
        storage_limit
        public_key
        metadata { # OperationContentsMetadataReveal!
            balance_updates { ... operationMetadataBalanceUpdates }
            internal_operation_results { # [InternalOperationResultReveal]
                kind
                info { # InternalOperationResultInfo
                    source
                    nonce
                    amount
                    destination
                    parameters { ... parameters }
                    public_key
                    balance
                    delegate
                    script { ... scriptedContract }
                }
                result { ... operationResultReveal }
            }
            operation_result { ... operationResultReveal }
        }
        operation { ... operationInfo }
    }
    seed_nonce_revelations { # [OperationContentsSeedNonceRevelation]!
        kind
        level
        nonce
        metadata { # OperationContentsMetadata!
            balance_updates { ... operationMetadataBalanceUpdates }
        }
        operation { ... operationInfo }
    }
    transactions { # [OperationContentsTransaction]!
        kind
        source
        fee
        counter
        gas_limit
        storage_limit
        amount
        destination
        parameters { ... michelsonExpr }
        metadata { # OperationContentsMetadataTransaction!
            balance_updates { ... operationMetadataBalanceUpdates }
            operation_result { ... operationResultTransaction }
            internal_operation_results { # [InternalOperationResultTransaction]
                kind
                info {
                    source
                    nonce
                    amount
                    destination
                    parameters { ... parameters }
                    public_key
                    balance
                    delegate
                    script { ... scriptedContract }
                }
                result { ... operationResultTransaction }
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
}

fragment parameters on TransactionOperationParameter {
    entrypoint
    value { ... michelsonExpr }
}

fragment scriptedContract on ScriptedContracts {
    code { ... michelsonExpr }
    storage { ... michelsonExpr }
}

fragment operationResultReveal on OperationResultReveal {
    status
    consumed_gas
    errors {
        kind
        id
    }
}

fragment operationResultTransaction on OperationResultTransaction {
    status
    consumed_gas
    errors {
        kind
        id
    }
    storage_base {
        int
        String
        bytes
    }
    storage_extended {
        prim
        annots
    }
    big_map_diff { # [ContractBigMapDiffItem]
        key_hash
        key { ... michelsonExpr }
        value { ... michelsonExpr }
    }
    balance_updates { ... balanceUpdates }
    originated_contracts
    storage_size
    paid_storage_size_diff
    allocated_destination_contract
}

`;

describe('GraphQL server', () => {
    beforeEach(() => {
        // 60s timeout for each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
    });

    async function testBlock(block: string) {
        var response = await axios.post('http://localhost:3000/graphql', {
            query: `{ block(block: "${block}") ${blockQuery} } ${fragments}`
        }, { validateStatus: () => true });

        if (response.status != 200) {
            fail(`Returned ${response.status} ${response.statusText}`)
        }

        expect(response.data.errors).toBeUndefined();
        if (response.data.errors) {
            console.debug(response.data.errors);
        }
    }

    function itReturnsOkForBlock(block: string, description: string) {
        it(`returns OK for ${block} (${description})`, async () => testBlock(block));
    }

    describe('on recent data', () => {
        itReturnsOkForBlock('896621', '006');
    });

    describe('on starting blocks', () => {
        itReturnsOkForBlock('851969', '006');
        itReturnsOkForBlock('655361', '005');
        itReturnsOkForBlock('458753', '004');
        itReturnsOkForBlock('204762', '003');
        itReturnsOkForBlock('2', '001');
        // itReturnsOkForBlock('1', '000');
        // itReturnsOkForBlock('0', 'Genesis');
    });

    describe('on operation sample', () => {
        itReturnsOkForBlock('896065', '006');
        itReturnsOkForBlock('696617', '005');
        itReturnsOkForBlock('554813', '004');
        itReturnsOkForBlock('32959', '002');
        itReturnsOkForBlock('28083', '002');
        itReturnsOkForBlock('3425', '001');
        itReturnsOkForBlock('446', '001');
        itReturnsOkForBlock('379', '001');
    });
});