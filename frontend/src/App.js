import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import data from "./Lottery.json";

/* 
NOTE: After deploying the contract you have to change this variable to
	  address of your contract.
*/
const address = "0x61BC315d4356597945D0246F27cfFDbaE22db6B5";
function App() {
	const [contract, setContract] = useState();

	const connect = async () => {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);
			const account = accounts[0];
			console.log(account);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(address, data.abi, signer);
			setContract(contract);
		} else {
			console.log("Install any Celo wallet");
		}
	};
	const purchaseTicket = async () => {
		try {
			const result = await contract.purchaseTicket({ value: ethers.utils.parseUnits("1", "ether") });
			console.log(result);
		} catch (error) {
			console.error(error.reason);
		}
	}
	const selectWinner = async () => {
		try {
			const result = await contract.selectWinner();
			console.log(result);
		} catch (error) {
			console.error(error.reason);
		}
	};

	return (
		<div className="App">
			<div className="row">
				<h1>Lottery Game</h1>
				<button onClick={connect}>
					{contract ? "Connected" : "Connect"}
				</button>
			</div>
			<div className="row">
				<button onClick={purchaseTicket}>Purchase Ticket</button>
				<button onClick={selectWinner}>Select Winner</button>
			</div>
		</div>
	);
}

export default App;