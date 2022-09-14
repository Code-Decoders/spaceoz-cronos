import React, { useEffect } from 'react'
import styles from '../styles/Warship.module.css'
import ReactBlockies from 'react-blockies'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis';
import { toast } from 'react-toastify';
import { InventoryAddress } from '../pages/_app';

const Warship = ({ ship, updateOwner }) => {

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


    const { runContractFunction: mint_existing, isFetching } = useWeb3Contract();

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
                    msgValue: Moralis.Units.ETH(ship.price / 10 ** 18),
                    params: {
                        token_id: ship.id,
                    },
                },
                onError: (error) => {
                    errorMsg(error?.data?.message ?? error.message)
                },
                onSuccess: (result) => {
                    successMsg('Transaction Signed and Submitted')
                }
            })
            if (transaction)
                transaction.wait().then((val) => {
                    successMsg('Transaction Successful')
                    updateOwner(ship.id)
                })
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
                        token_id: ship.id
                    },
                },
                onError: (error) => {
                    errorMsg(error?.data?.message ?? error.message)
                },
                onSuccess: (result) => {
                    successMsg('Transaction Signed and Submitted')
                }
            })
            if (transaction)
                transaction.wait().then((val) => {
                    successMsg('Transaction Successful')
                    updateOwner(ship.id)
                });
        }
    }

    return (
        <div className={styles['warship-container']}>
            <img src={ship.image} className={styles['warship-image']} />
            <div className={styles['warship-title']}>{ship.name}</div>
            <div className={styles['warship-owners']}>
                <div style={{ fontSize: "15px" }}>Owners: {ship.owners.length}</div>
                <div style={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                    {
                        ship.owners.slice(0, 3).map((e, i) => {
                            return <ReactBlockies key={i} seed={e} size={7} className={styles['warship-owner']} />
                        })
                    }
                    {ship.owners.length > 3 && <div>...More</div>}
                </div>
            </div>
            <div className={styles['action-bar']}>
                <div className={styles['action-button']} onClick={handleBuyWithTCRO}>{ship.price / 10 ** 18} tCRO</div>
                <div className={styles['action-button']} onClick={handleByWithSPZ}>{ship.priceSPZ} SPT</div>
            </div>
        </div>
    )
}

export default Warship