import React, { useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { toast } from 'react-toastify'
import { InventoryAddress } from '../pages/_app'
import styles from '../styles/Upgrades.module.css'

const Upgrades = ({ upgrade, index, updateOwner }) => {

    const errorMsg = (message) => {
        toast.error(message);
    }

    const successMsg = (message) => {
        toast.success(message);
    }

    const mint_existing_abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "token_id",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ]

    const { enableWeb3, isWeb3Enabled, isAuthenticated, Moralis } = useMoralis()


    const { runContractFunction: mint_existing } = useWeb3Contract();



    useEffect(() => {
        enableWeb3()
    }, [])

    const handleBuyWithTCRO = async () => {
        console.log('buy with tCRO')
        if (isWeb3Enabled && isAuthenticated) {
            var transaction = await mint_existing({
                params: {
                    abi: mint_existing_abi,
                    contractAddress: InventoryAddress,
                    functionName: "mint",
                    msgValue: Moralis.Units.ETH(upgrade.price / 10 ** 18),
                    params: {
                        token_id: upgrade.id,
                    },
                },
                onError: (error) => {
                    errorMsg(error?.data?.message ?? error.message)
                },
                onSuccess: (result) => {
                    successMsg('Transaction Signed and Submitted')
                }
            })

            if (transaction) {
                transaction.wait().then((val) => {
                    successMsg('Transaction Successful')
                    updateOwner(upgrade.id)
                });
            }
        }
    }

    const handleByWithSPZ = async () => {
        console.log("buy with spz")
        if (isWeb3Enabled && isAuthenticated) {

            var transaction = await mint_existing({
                params: {
                    abi: mint_existing_abi,
                    contractAddress: InventoryAddress,
                    functionName: "mint",
                    msgValue: Moralis.Units.ETH(0),
                    params: {
                        token_id: upgrade.id
                    },
                },
                onError: (error) => {
                    errorMsg(error?.data?.message ?? error.message)
                },
                onSuccess: (result) => {
                    successMsg('Transaction Signed and Submitted')
                },
            })
            if (transaction) {
                transaction.wait().then((val) => {
                    successMsg('Transaction Successful')
                    updateOwner(upgrade.id)
                });
            }
        }
    }

    return (
        <tr>
            <td>{index}</td>
            <td><span><img src={upgrade.image} className={styles['image']} />{upgrade.name}</span></td>
            <td className={styles.center}>20% Damage</td>
            <td className={styles['action-bar']}>
                <div className={styles['action-button']} onClick={handleBuyWithTCRO}>{upgrade.price / 10 ** 18} tCRO</div>
                <div className={styles['action-button']} onClick={handleByWithSPZ}>{upgrade.priceSPZ} SPT</div>
            </td>
            <td className={styles.center}>
                {upgrade.owners.length}
            </td>
        </tr>
    )
}

export default Upgrades