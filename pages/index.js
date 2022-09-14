import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'
import { toast } from 'react-toastify'
import Upgrades from '../components/Upgrades'
import Warship from '../components/Warship'
import styles from '../styles/Home.module.css'
import InventoryABI from '../build/contracts/SpaceOzInventory.json'
import { InventoryAddress } from './_app'

export const metadata = [
  {
    id: 1,
    name: "Vanquisher",
    image: "https://i.imgur.com/A4GZGWN.png",
    type: "Warship",
    price: 0.1 * 10 ** 18,
    priceSPZ: 100,
  },
  {
    id: 2,
    name: "Alpha Fire",
    image: "https://i.imgur.com/RjR5hji.png",
    type: "Warship",
    price: 0.1 * 10 ** 18,
    priceSPZ: 100,
  },
  {
    id: 3,
    name: "Turbo Fire",
    image: "https://i.imgur.com/F2JqkIb.png",
    type: "Warship",
    price: 0.1 * 10 ** 18,
    priceSPZ: 100,
  },
  {
    id: 4,
    name: "Nimble",
    image: "https://i.imgur.com/aPnP0PV.png",
    type: "Warship",
    price: 0.1 * 10 ** 18,
    priceSPZ: 100,
  },
  {
    id: 5,
    name: "Combat Ninja",
    image: "https://i.imgur.com/rmEL6Pj.png",
    type: "Warship",
    price: 0.2 * 10 ** 18,
    priceSPZ: 200,
  },
  {
    id: 6,
    name: "Sonic Shot",
    image: "https://i.imgur.com/9h9fVRq.png",
    type: "Upgrades",
    price: 0.05 * 10 ** 18,
    priceSPZ: 50,
  },
  {
    id: 7,
    name: "Fireball",
    image: "https://i.imgur.com/aED8EHe.png",
    type: "Upgrades",
    price: 0.05 * 10 ** 18,
    priceSPZ: 50,
  },
  {
    id: 8,
    name: "Laser Shot",
    image: "https://i.imgur.com/SMkQOPA.png",
    type: "Upgrades",
    price: 0.05 * 10 ** 18,
    priceSPZ: 50,
  }

]

export default function Home() {
  const [ships, setShips] = React.useState([])
  const [upgrades, setUpgrades] = React.useState([])
  const Web3API = useMoralisWeb3Api()
  const { isInitialized,isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis()

  

  const getData = async () => {
    if (isInitialized && isWeb3Enabled) {
      console.log("getData")
      const json = await Web3API.token.getAllTokenIds({
        address: InventoryAddress,
        chain: '0x152'
      })

      const ids = json.result.map(e => parseInt(e.token_id));
      await new Promise(resolve => setTimeout(resolve, 1000));
      const owners_json = await Web3API.token.getNFTOwners({
        chain: '0x152',
        address: InventoryAddress,
      })
      console.log(owners_json)
      for (const key in ids) {

        const id = ids[key];
        console.log(id)
        await new Promise(resolve => setTimeout(resolve, 300));

        var data = metadata.find(e => e.id === id);
        const owners = owners_json.result.filter(e => e.token_id == id).map(e => e.owner_of);
        console.log(owners)
        if (data.type === "Warship") {
          setShips(val => {
            val.push({ ...data, owners: owners })
            // remove duplicates from array where id is the same
            return [...new Set(val.map(item => item.id))].map(id => {
              return val.find(item => item.id === id)
            })
          })
        }
        else {
          setUpgrades(val => {
            val.push({ ...data, owners: owners })
            // remove duplicates from array where id is the same
            return [...new Set(val.map(item => item.id))].map(id => {
              return val.find(item => item.id === id)
            })
          })
        }
      }
    }
  }


  const updateOwners = async (id) => {
    if (isAuthenticated && isWeb3Enabled) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const owners_json = await Web3API.token.getTokenIdOwners({
        chain: '0x152',
        token_id: id,
        address: InventoryAddress,
      })
      var data = metadata.find(e => e.id === id);
      console.log(owners_json)
      const owners = owners_json.result.map(e => e.owner_of);
      console.log(owners)
      if (data.type === "Warship") {
        setShips(val => {
          return val.map(item => {
            if (item.id === id) {
              return { ...item, owners: owners }
            }
            return item
          }
          )
        })
      }
      else {
        setUpgrades(val => {
          return val.map(item => {
            if (item.id === id) {
              return { ...item, owners: owners }
            }
            return item
          })
        })
      }
    }
  }

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3()
    }
    getData()
  }, [isInitialized, isWeb3Enabled])
  return (
    <div className={styles['home-container']}>
      <div style={{ padding: "2rem" }}>
        <h1>Trending Warships</h1>
        <div className={styles['horizontal-listview-container']}>
          <div className={styles['horizontal-listview']}>
            {
              ships.map((val, i) => (
                <Warship key={i} ship={val} updateOwner={updateOwners} />))
            }
          </div>
        </div>
        <h1>Top Upgrades</h1>

        <table className={styles['upgrade-table']}>
          <thead>
            <tr style={{ padding: "1rem" }}>
              <th></th>
              <th style={{ textAlign: "left" }}>Collection</th>
              <th>Damage</th>
              <th>Buy</th>
              <th>Owners</th>
            </tr>
          </thead>
          <tbody>
            {
              upgrades.map((val, i) => {
                return <Upgrades key={i} index={i + 1} upgrade={val} updateOwner={updateOwners} />
              })
            }
          </tbody>
        </table>
      </div>
      <footer className={styles.footer}>
        <a
          href="https://github.com/Code-Decoders"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '} CodeDecoders
        </a>
      </footer>
    </div>
  )
}
