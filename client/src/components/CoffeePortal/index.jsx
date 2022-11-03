import { useEffect, useState } from 'react'
import Web3 from 'web3'
import artifact from '../../contracts/CoffeePortal.json';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')

export default function CoffeePortal() {
    const [account, setAccount] = useState('')
    const [balance, setBalance] = useState(0)
    const [network, setNetwork] = useState(0)
    const [contract, setContract] = useState(0)
    const [totalCoffee, setTotalCoffee] = useState(0)
    const [allCoffees, setAllCoffees] = useState([])
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {

        async function loadAccount() {
            const accounts = await web3.eth.requestAccounts()
            const _account = accounts[0]
            setAccount(_account)

            const network = await web3.eth.net.getNetworkType()
            const balance = await web3.eth.getBalance(_account)
            setNetwork(network)
            setBalance((balance / 1e18).toFixed(4))
        }

        const loadContract = async () => {
            const networkID = await web3.eth.net.getId();
            const { abi } = artifact;
            try {
                const address = artifact.networks[networkID].address
                const contract = new web3.eth.Contract(abi, address);
                setContract(contract)
            } catch (err) {
                console.error(err);
            }

        };

        ; (async () => {
            await loadAccount()
            await loadContract()
        })()

    }, [])

    useEffect(() => {
        getTotalCoffee()
        getAllCoffees()
    }, [contract])

    const getTotalCoffee = async () => {
        if (contract) {
            const totalCoffee = await contract.methods.getTotalCoffee().call();
            setTotalCoffee(totalCoffee)
        }
    }

    const getAllCoffees = async () => {
        if (contract) {
            const allCoffees = await contract.methods.getAllCoffee().call();
            setAllCoffees(allCoffees)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const coffeeTxn = await contract.methods
                .buyCoffee(
                    message.trim() === '' ? '' : message.trim(),
                    name.trim() === '' ? 'Anonymous' : name.trim(),
                    Web3.utils.toWei('0.001', 'ether')
                )
                .send({ from: account, gasLimit: 300000 });

            console.log("Mining...", coffeeTxn.hash);
            await getAllCoffees()
            setSubmitting(false);
        } catch (e) {
            console.log(e);
        }
    }

    const handleOnNameChange = (event) => {
        const { value } = event.target;
        setName(value);
    };

    const handleOnMessageChange = (event) => {
        const { value } = event.target;
        setMessage(value);
    };

    return (
        <div>
            <div>
                My account: {account}
            </div>
            <div>
                Network: {network}
            </div>
            <div>
                Balance: {balance}
            </div>

            <div>
                {totalCoffee > 0
                    ? <>Thanks I got {totalCoffee} coffee(s)</>
                    : <>I am thirsty, please give me something!</>
                }
            </div>

            <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="my-name" className="form-label">My name</label>
                    <input className="form-control" id="my-name" placeholder="What's your name?" onChange={handleOnNameChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="my-message" className="form-label">My message</label>
                    <textarea className="form-control" id="my-message"  placeholder="Write something nice..." rows="3" onChange={handleOnMessageChange}></textarea>
                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-3">Buy me this coffee!</button>
                </div>
            </form>

            {submitting &&
                <div>Submtting Form...</div>
            }

            <hr />

            <h2>My generous donors</h2>
            <ol className="list-group list-group-numbered">
                {allCoffees.map((coffee) => {
                    return (
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{coffee.name}</div>
                                <div>{coffee.message}</div>
                                <div>{coffee.giver}</div>
                            </div>
                        </li>
                    )
                })}

            </ol>

        </div>
    )
}