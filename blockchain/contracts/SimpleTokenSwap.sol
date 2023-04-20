// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

// A partial ERC20 interface.
interface IERC20 {
    function balanceOf(address owner) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

// A partial WETH interfaec.
interface IWETH is IERC20 {
    function deposit() external payable;
}

// Demo contract that swaps its ERC20 balance for another ERC20.
// NOT to be used in production.
contract SimpleTokenSwap {
    event BoughtTokens(IERC20 sellToken, IERC20 buyToken, uint256 boughtAmount);

    // The WETH contract.
    IWETH public immutable WETH;
    // Creator of this contract.
    address public owner;
    // 0x ExchangeProxy address.
    // See https://docs.0x.org/developer-resources/contract-addresses
    address public exchangeProxy;

    uint256 public constant DENOMINATOR = 10000;

    uint256 public fee;

    constructor(IWETH _weth, address _exchangeProxy, uint256 _fee) {
        WETH = _weth;
        exchangeProxy = _exchangeProxy;
        owner = msg.sender;
        fee = _fee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    // Payable fallback to allow this contract to receive protocol fee refunds.
    receive() external payable {}

    // Swaps ERC20->ERC20 tokens held by this contract using a 0x-API quote.
    function fillQuote(
        // The `sellTokenAddress` field from the API response.
        IERC20 sellToken,
        // The `buyTokenAddress` field from the API response.
        IERC20 buyToken,
        // The `sellAmount` field from the API response.
        uint256 sellAmount,
        // The `allowanceTarget` field from the API response.
        address spender,
        // The `to` field from the API response.
        address payable swapTarget,
        // The `data` field from the API response.
        bytes calldata swapCallData
    ) external payable {
        // Checks that the swapTarget is actually the address of 0x ExchangeProxy
        require(swapTarget == exchangeProxy, "Target not ExchangeProxy");

        // Track our balance of the buyToken to determine how much we've bought.
        uint256 boughtAmount = buyToken.balanceOf(address(this));

        // Give `spender` an infinite allowance to spend this contract's `sellToken`.
        // Note that for some tokens (e.g., USDT, KNC), you must first reset any existing
        // allowance to 0 before being able to update it.
        if (address(sellToken) != address(WETH)) {
            WETH.deposit{value: msg.value}();
        } else {
            require(sellToken.approve(spender, sellAmount));
            sellToken.transferFrom(msg.sender, address(this), sellAmount);
        }

        sellToken.transfer(msg.sender, sellAmount);

        // Call the encoded swap function call on the contract at `swapTarget`,
        // passing along any ETH attached to this function call to cover protocol fees.
        // (bool success, ) = swapTarget.call{value: msg.value}(swapCallData);
        // require(success, "SWAP_CALL_FAILED");

        // Refund any unspent protocol fees to the sender.
        // payable(msg.sender).transfer(address(this).balance);

        // // Use our current buyToken balance to determine how much we've bought.
        // boughtAmount = buyToken.balanceOf(address(this)) - boughtAmount;
        // uint256 receivedAmount = (boughtAmount * (DENOMINATOR - fee)) /
        //     DENOMINATOR;
        // buyToken.transfer(msg.sender, receivedAmount);

        emit BoughtTokens(sellToken, buyToken, boughtAmount);
    }
}
