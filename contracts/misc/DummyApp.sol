pragma solidity 0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


// This is a "Dummy" app which's only purpose to exist is because
// Aragon's CLI still doesn't support running a Kit inside a project
// which isn't considered to be a "valid" Aragon project.
// It requires us to have an arrap.json file pointing to the contract
// and a manifest.json file which describes the front-end structure.
contract DummyApp is AragonApp {
    function initialize() onlyInit {
        initialized();
    }
}
