import axios, { AxiosResponse } from 'axios';

export const blockFields = `
    protocol
    chainId
    hash
    header { ... blockHeader }
    metadata {
        protocol
        nextProtocol
        testChainStatus {
            status
        }
        maxOperationsTtl
        maxOperationDataLength
        maxBlockHeaderLength
        maxOperationListLength {
            maxSize
            maxOp
        }
        baker
        level {
            level
            levelPosition
            cycle
            cyclePosition
            votingPeriod
            votingPeriodPosition
            expectedCommitment
        }
        votingPeriodKind
        nonceHash
        consumedGas
        deactivated
        balanceUpdates { ... balanceUpdate }
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
            balanceUpdates { ... balanceUpdate }
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
        gasLimit
        storageLimit
        delegate
        metadata {
            balanceUpdates { ... balanceUpdate }
            operationResult {
                status
                consumedGas
                errors {
                    kind
                    id
                }
            }
            internalOperationResults {
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                publicKey
                balance
                delegate
                script { ... scriptedContract }
                result {
                    status
                    consumedGas
                    errors {
                        kind
                        id
                    }
                }
            }
        }
        operation { ... operationInfo }
    }
    doubleBakingEvidence {
        kind
        bh1 { ... blockHeader }
        bh2 { ... blockHeader }
        metadata {
            balanceUpdates { ... balanceUpdate }
        }
        operation { ... operationInfo }
    }
    doubleEndorsementEvidence {
        kind
        op1 { ... inlinedEndorsement }
        op2 { ... inlinedEndorsement }
        metadata {
            balanceUpdates { ... balanceUpdate }
        }
        operation { ... operationInfo }
    }
    endorsements {
        kind
        level
        metadata {
            balanceUpdates { ... balanceUpdate }
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
        gasLimit
        storageLimit
        balance
        delegate
        script {
            code
            storage
        }
        metadata {
            balanceUpdates { ... balanceUpdate }
            operationResult { ... originationOperationResult }
            internalOperationResults {
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                publicKey
                balance
                delegate
                script { ... scriptedContract }
                result { ... originationOperationResult }
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
        gasLimit
        storageLimit
        publicKey
        metadata { # OperationContentsMetadataReveal!
            balanceUpdates { ... balanceUpdate }
            internalOperationResults { # [InternalOperationResultReveal]
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                publicKey
                balance
                delegate
                script { ... scriptedContract }
                result { ... revealOperationResult }
            }
            operationResult { ... revealOperationResult }
        }
        operation { ... operationInfo }
    }
    seedNonceRevelations { # [OperationContentsSeedNonceRevelation]!
        kind
        level
        nonce
        metadata { # OperationContentsMetadata!
            balanceUpdates { ... balanceUpdate }
        }
        operation { ... operationInfo }
    }
    transactions { # [OperationContentsTransaction]!
        kind
        source
        fee
        counter
        gasLimit
        storageLimit
        amount
        destination
        parameters
        metadata { # OperationContentsMetadataTransaction!
            balanceUpdates { ... balanceUpdate }
            operationResult { ... transactionOperationResult }
            internalOperationResults { # [InternalOperationResultTransaction]
                kind
                source
                nonce
                amount
                destination
                parameters { ... parameters }
                publicKey
                balance
                delegate
                script { ... scriptedContract }
                result { ... transactionOperationResult }
            }
        }
        operation { ... operationInfo }
    }
`;

export const fragments = `
fragment operationInfo on OperationEntryInfo {
    protocol
    chainId
    hash
    branch
    signature
}

fragment blockHeader on BlockHeader {
    level
    proto
    predecessor
    timestamp
    validationPass
    operationsHash
    fitness
    context
    priority
    proofOfWorkNonce
    seedNonceHash
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

fragment originationOperationResult on OriginationOperationResult {
    status
    consumedGas
    errors {
        kind
        id
    }
    balanceUpdates  { ... balanceUpdate }
    originatedContracts
    storageSize
    paidStorageSizeDiff
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
    consumedGas
    errors {
        kind
        id
    }
}

fragment transactionOperationResult on TransactionOperationResult {
    status
    consumedGas
    errors {
        kind
        id
    }
    storage
    bigMapDiff { # [ContractBigMapDiffItem]
        keyHash
        key
        value
    }
    balanceUpdates { ... balanceUpdate }
    originatedContracts
    storageSize
    paidStorageSizeDiff
    allocatedDestinationContract
}
`;

export const contractField = `contract(address: "KT1MsoUy2Sunt5rBbvRGxKf2zDxHE9teRJw7") {
    balance
    script {
        code
        storage
    }
    counter
    entrypoints {
        entrypoints
    }
    managerKey {
        key
        invalid
    }
    storage
    delegate
}`;

export const delegateField = `delegate(address: "tz1LcuQHNVQEWP2fZjk1QYZGNrfLDwrT3SyZ") {
    balance
    frozenBalance
    stakingBalance
    delegatedContracts
    delegatedBalance
    deactivated
    gracePeriod
    frozenBalanceByCycle {
        cycle
        deposit
        fees
        rewards
    }
}`;

export const delegateWithBakingRightsField = `delegateWithBakingRights: delegate(address: "tz1WCd2jm4uSt4vntk4vSuUWoZQGhLcDuR9q") {
  endorsingRights(level: 892956) {
    level
    slots
    estimatedTime
  }
  bakingRights(level: 893408) {
    level
    priority
    estimatedTime
  }
}`;

export const bigMaps = `bigMapContract1: contract(address: "KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv") {
  bigMapValue(key: "tz1WAVpSaCFtLQKSJkrdVApCQC1TNK8iNxq9", keyType: ADDRESS, bigMapId: 20)
}
  
bigMapContract2: contract(address: "KT1ChNsEFxwyCbJyWGSL3KdjeXE28AY1Kaog") {
  value1: bigMapValue(key: "tz1WCd2jm4uSt4vntk4vSuUWoZQGhLcDuR9q", keyType: KEY_HASH, bigMapId: 17)
  value2: bigMapValue(key: "tz1WCd2jm4uSt4vntk4vSuUWoZQGhLcDuR9q", keyType: KEY_HASH)
  bigMapValueDecoded(key: "tz1WCd2jm4uSt4vntk4vSuUWoZQGhLcDuR9q")
    
  notFound1: bigMapValue(key: "tz1WAVpSaCFtLQKSJkrdVApCQC1TNK8iNxq9", keyType: KEY_HASH, bigMapId: 17)
  notFound2: bigMapValueDecoded(key: "tz1WAVpSaCFtLQKSJkrdVApCQC1TNK8iNxq9")
}`;

export const constantsField = `constants {
    endorsementReward
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
