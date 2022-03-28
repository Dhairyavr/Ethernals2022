// SPDX-License-Identifier: GPL-3.0
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/metatx/ERC2771Context.sol";

pragma solidity ^0.8.9;

contract EthQF is ERC20,ERC2771Context {

    uint public round_id=0;

    struct startendProjectid {
        uint start;
        uint end;
    }

    mapping (uint => startendProjectid) public roundProjectids;

    mapping (uint=> bool) public roundStatus;

    
     struct Project  {
        address owner;
        string ipfsHash;
        uint crowdfundAmount;
        uint sqrtAmount;
        //bool projStatus; status of project flag will be maintained in mongodb
        uint no_of_installments;
        uint remaining_installments;
        uint[] installment_ids;
        string date;
        uint installment_amount;
        string amountToRaise;
    }
    
    struct Sponsor {
        address owner;
        uint poolAmount;
    }
    
    /*struct Dispute {
        uint project_id;
        uint in_favour;
        uint out_of_favour;
        bool disputeStatus;
    }*/
    
    struct Installment {
        uint yes;
        uint no;
        uint contributors;
        //bool completed; status of Installment flag will be maintained in mongodb
        string date;
    } 
    
    uint public totalSponsors=0;
    uint public total_amount=0;
    uint public liquidity_pool_amount=0;

    //create return functions for projectCollection,projectIdCollection,contributedTo--------pending

    mapping (address => Project[]) public projectCollection;

    mapping(address=> uint[]) public projectIdCollection;
    
    mapping (uint => address [] ) public contributedTo;
    
    mapping (uint => mapping(address => bool ) ) public check_contributed_to ; //project id to address of contributor to true/false false = Not contributed, true = contributed
    
    uint public project_id=1;
    mapping(uint => Project) public projects;
    
    mapping(uint => uint) public project_sum_amount;
    
    uint public sponsor_id=0; 
    mapping(uint => Sponsor) public sponsors;

    mapping(uint=> address[]) public roundSpecificSponsor;
    
    uint public installment_id=0;
    mapping(uint => Installment[] ) public installments;
    
    mapping (uint => mapping(uint=>mapping(address => bool)) ) public contributorVotingStatus; // project_id to installment_id to voter address to true/false false=Not Voted , True=Voted
    
    event Contribution(address indexed contributor,uint amount,uint indexed project_id,string date);

    event Refund(address indexed contributor,uint amount,uint indexed project_id,string date);
   
   constructor() ERC20("VTOKENS","VTK") ERC2771Context(0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b)   {

    }

    

    function _msgSender() internal view virtual override(Context,ERC2771Context) returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual override(Context,ERC2771Context) returns (bytes calldata) {
        return msg.data;
    }


   function startRound () public {
    round_id+=1;
    roundStatus[round_id]=true;
   }

   function getContributorVotingStatus(uint _project_id,uint _installment_id,address _address) public view returns(bool) {
       
       return contributorVotingStatus[_project_id][_installment_id][_address];
   }

   function getDetails () public view returns (uint,uint) {
   
    return(round_id,project_id);
    }

    function getprojectCollection (address _address) public view returns(Project[] memory) {
    
        return projectCollection[_address];
    }

    function getprojectIdCollection (address _address) public view returns (uint[] memory) {
        
        return projectIdCollection[_address];
    }

    function getcontributedTo (uint _project_id) public view returns (address[] memory) {
        
        return contributedTo[_project_id];
    }

    function getinstallmentCollection (uint _project_id) public view returns (Installment[] memory) {

        return installments[_project_id];
    }

    function getprojectInstallmentIds (uint _project_id) public view returns (uint[] memory) {

        return projects[_project_id].installment_ids;
    }

    function getProjectInstallmentDetails (uint _project_id) public view returns(uint,uint) {

        return (projects[_project_id].no_of_installments,projects[_project_id].remaining_installments);
    }

    function getRoundSpecificSponsors(uint _round_id) public view returns(address[] memory) {

        return roundSpecificSponsor[_round_id];
    }
   
   function createProject (address _creator,string memory _ipfsHash,uint  _no_of_installments,string memory _date,string memory _amountToRaise)  public {
       uint [] memory _installment_ids;
       Project memory proj= Project(_creator,_ipfsHash,0,0,_no_of_installments,_no_of_installments,_installment_ids, _date,0,_amountToRaise );
       projects[project_id]=proj;
       project_id+=1;

        if(roundProjectids[round_id].start==0) {
            roundProjectids[round_id].start=project_id-1;
            roundProjectids[round_id].end=project_id-1;
        }
        else {
            roundProjectids[round_id].end=project_id-1;
        }

        projectCollection[_creator].push(proj);
        projectIdCollection[_creator].push(project_id-1);

   }
   
   function enrollSponsor(uint _round_id,address _sponsor,uint _amount) payable public {
       
       Sponsor memory sp=Sponsor(_sponsor,_amount);
       sponsors[sponsor_id]=sp;
       liquidity_pool_amount+=_amount;
       sponsor_id+=1;
       totalSponsors+=1;
       roundSpecificSponsor[_round_id].push(_sponsor);
   }
   
   function projectSqrtAmount(uint _project_id) public view returns(uint) {
       
       return projects[_project_id].sqrtAmount;
   }
   
   function contractBalance () public view returns (uint) {
       
       return address(this).balance;
   }
    
//_amount has simple Contribution amount , _sqrtAmount is the square root of individual Contribution and sq_amount is square of projects[_project_id].sqrtAmount   
// call projectSqrtAmount to get old sum of square roots , add square root of current Contribution to it and take a square of that amount & pass it as sq_amount 
    
    function makeContribution(address _contributor,uint _project_id,uint _amount,uint sq_amount,uint _sqrtAmount,string memory _date) payable public { 

        require(_project_id < project_id,"Invalid Project Id ");
        
        emit Contribution(_contributor,_amount,_project_id,_date);
        projects[_project_id].crowdfundAmount+=_amount;
        projects[_project_id].sqrtAmount+=_sqrtAmount;
        
        if(check_contributed_to[_project_id][_contributor]==false) {
            
            contributedTo[_project_id].push(_contributor);
            check_contributed_to[_project_id][_contributor]=true;
            _mint(_contributor,projects[_project_id].no_of_installments* (10**18) );
        
        }
        total_amount-=project_sum_amount[_project_id];
        project_sum_amount[_project_id]=sq_amount;
        total_amount+=project_sum_amount[_project_id];

    }
    
    function projectDetails(uint _project_id) public view returns (uint,uint,uint,uint,uint) {
        
        return (
        liquidity_pool_amount,
        total_amount,
        projects[_project_id].crowdfundAmount,
        project_sum_amount[_project_id],
        projects[_project_id].no_of_installments 
        );
    }

//call projectDetails before and calculate 
//_quadratic_funding_amount = (crowdfundAmount + (  (project_sum_amount[_project_id]/total_amount)*liquidity_pool_amount ) ) / projects[_project_id].no_of_installments     

    function retrieveFirstInstallment(address _owner,uint _project_id,uint _quadratic_funding_amount) public {
        
        require(_owner==projects[_project_id].owner,"Invalid Owner");
        
        projects[_project_id].remaining_installments-=1;
        
        projects[_project_id].installment_amount=_quadratic_funding_amount;
        payable(projects[_project_id].owner).transfer(_quadratic_funding_amount);
    }
    
//this function is called everytime(except for 1st installment) to get Installment amount after voting is done in favour of yes 
    
    function retrieveInstallment (address _owner,uint _project_id) public {
        
        require(projects[_project_id].remaining_installments > 0 ,"No installments remaining ");
        require(_owner==projects[_project_id].owner,"Invalid Owner");

        projects[_project_id].remaining_installments-=1;

        payable(projects[_project_id].owner).transfer(projects[_project_id].installment_amount);
    }
            
//Vote 0 = No and 1 = Yes

    function castVote(address _voter,uint _project_id,uint vote) public { 

        uint length=projects[_project_id].installment_ids.length;
        uint id=projects[_project_id].installment_ids[length-1];
        
        require(contributorVotingStatus[_project_id][id][_voter]==false,"Voter has already voted in this Installment");
        
        uint it_length=installments[_project_id].length;
        
        if(vote==0) {
            installments[_project_id][it_length-1].no+=1;    
        }
        else {
            installments[_project_id][it_length-1].yes+=1;
        }
        installments[_project_id][it_length-1].contributors+=1;
        contributorVotingStatus[_project_id][id][_voter]=true;
        _burn(_voter,1*(10**18));
        
    }

        function castFirstVote(address _voter,uint _project_id,uint vote,string memory _date) public { 

        Installment memory it=Installment(0,0,0,_date);
        installments[_project_id].push(it);

        uint ids_length=projects[_project_id].installment_ids.length;

        if(ids_length==0)
        projects[_project_id].installment_ids.push(0);
        else 
        projects[_project_id].installment_ids.push(projects[_project_id].installment_ids[ids_length-1]+1);

        //projects[_project_id].remaining_installments-=1;
    
        uint length=projects[_project_id].installment_ids.length;
        uint id=projects[_project_id].installment_ids[length-1];
        
        require(contributorVotingStatus[_project_id][id][_voter]==false,"Voter has already voted in this Installment");
        
        uint it_length=installments[_project_id].length;
        
        if(vote==0) {
            installments[_project_id][it_length-1].no+=1;    
        }
        else {
            installments[_project_id][it_length-1].yes+=1;
        }
        installments[_project_id][it_length-1].contributors+=1;
        contributorVotingStatus[_project_id][id][_voter]=true;
        _burn(_voter,1*(10**18));
        
    }
    
    function getResult(uint _project_id ) public view returns(uint,uint,uint) {
        uint it_length=installments[_project_id].length;
        
        return (
        installments[_project_id][it_length-1].yes,
        installments[_project_id][it_length-1].no,
        installments[_project_id][it_length-1].contributors
        );
    }

    function refundContribution (uint _amount,address _address,uint _project_id,string memory date) public {
        
        emit Refund(_address,_amount,_project_id,date);
        payable(_address).transfer(_amount);
    }
    
}