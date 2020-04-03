import axios from 'axios';

(async function() {
    var response = await axios.post('http://localhost:3000/graphql', {
        query: `{
            block(block: "head")
            {
                transactions {
                    source
                    destination
                    amount
                }
            }
        }`
    });
    
    console.log(`statusCode: ${response.status}`)
    console.log(response.data)
})();
