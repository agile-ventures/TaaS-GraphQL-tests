import axios, { AxiosResponse } from 'axios';

export const blockFields = `
    protocol
    chain_id
    hash
    header { ... blockHeader }
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
        nonce_hash
        consumed_gas
        deactivated
        balance_updates { ... balanceUpdate }
    }
    operations {
        info { ... operationInfo }
        contents {
            kind
            operation { ... operationInfo }
        }
    }
    activations {
        kind
        pkh
        secret
        metadata {
            balance_updates { ... balanceUpdate }
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
            balance_updates { ... balanceUpdate }
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
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                public_key
                balance
                delegate
                script { ... scriptedContract }
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
        bh1 { ... blockHeader }
        bh2 { ... blockHeader }
        metadata {
            balance_updates { ... balanceUpdate }
        }
        operation { ... operationInfo }
    }
    double_endorsement_evidence {
        kind
        op1 { ... inlinedEndorsement }
        op2 { ... inlinedEndorsement }
        metadata {
            balance_updates { ... balanceUpdate }
        }
        operation { ... operationInfo }
    }
    endorsements {
        kind
        level
        metadata {
            balance_updates { ... balanceUpdate }
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
            code
            storage
        }
        metadata {
            balance_updates { ... balanceUpdate }
            operation_result { ... operationResultOrigination }
            internal_operation_results {
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                public_key
                balance
                delegate
                script { ... scriptedContract }
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
            balance_updates { ... balanceUpdate }
            internal_operation_results { # [InternalOperationResultReveal]
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                public_key
                balance
                delegate
                script { ... scriptedContract }
                result { ... revealOperationResult }
            }
            operation_result { ... revealOperationResult }
        }
        operation { ... operationInfo }
    }
    seed_nonce_revelations { # [OperationContentsSeedNonceRevelation]!
        kind
        level
        nonce
        metadata { # OperationContentsMetadata!
            balance_updates { ... balanceUpdate }
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
        parameters
        metadata { # OperationContentsMetadataTransaction!
            balance_updates { ... balanceUpdate }
            operation_result { ... operationResultTransaction }
            internal_operation_results { # [InternalOperationResultTransaction]
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                public_key
                balance
                delegate
                script { ... scriptedContract }
                result { ... operationResultTransaction }
            }
        }
        operation { ... operationInfo }
    }
`;

export const fragments = `
fragment operationInfo on OperationEntryInfo {
    protocol
    chain_id
    hash
    branch
    signature
}

fragment blockHeader on BlockHeader {
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

fragment balanceUpdate on BalanceUpdate {
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
    balance_updates  { ... balanceUpdate }
    originated_contracts
    storage_size
    paid_storage_size_diff
}

fragment parameters on TransactionOperationParameter {
    entrypoint
    value
}

fragment scriptedContract on ScriptedContracts {
    code
    storage
}

fragment revealOperationResult on RevealOperationResult {
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
    storage_base
    storage_extended
    big_map_diff { # [ContractBigMapDiffItem]
        key_hash
        key
        value
    }
    balance_updates { ... balanceUpdate }
    originated_contracts
    storage_size
    paid_storage_size_diff
    allocated_destination_contract
}
`;

export const contractField = `contract(address: "KT1MsoUy2Sunt5rBbvRGxKf2zDxHE9teRJw7") {
    balance
    script {
        code
        storage
    }
    counter
    entrypoint {
    entrypoints
    }
    manager_key {
        key
        invalid
    }
    storage
    delegate
}`;

export const delegateField = `delegate(address: "tz1LcuQHNVQEWP2fZjk1QYZGNrfLDwrT3SyZ") {
    balance
    frozen_balance
    staking_balance
    delegated_contracts
    delegated_balance
    deactivated
    grace_period
    frozen_balance_by_cycle {
        cycle
        deposit
        fees
        rewards
    }
}`;

export async function testQuery(query: string) {
    var response = await axios.post(
        'http://localhost:3000/graphql',
        {
            query,
        },
        { validateStatus: () => true }
    );

    if (response.status != 200) {
        fail(`Returned ${response.status} ${response.statusText}`);
    }

    expect(response.data.errors).toBeUndefined();
    if (response.data.errors) {
        console.debug(response.data.errors);
    }
    return response;
}

export async function testBlock(block: string, additionalBlockFields: string[] = []) {
    return await testQuery(`{ block(block: "${block}") { ${blockFields} ${additionalBlockFields.join(' ')} } } ${fragments}`);
}

export async function testBlocksQuery(queryArguments: string) {
    return await testQuery(`{ blocks(${queryArguments}) { ${blockFields} } } ${fragments}`);
}
