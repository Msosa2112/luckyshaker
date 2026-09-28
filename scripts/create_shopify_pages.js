const http = require('http');

const GRAPHIQL_KEY = 'fd7c3f25ac39c648dd6ccc09ca0c0e2f0c043082aace04e441434d110cd5f625';

function runGraphQL(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });

    const req = http.request({
      hostname: 'localhost',
      port: 3457,
      path: '/graphiql/graphql.json?key=' + GRAPHIQL_KEY,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, error: e.message });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const pageCreateMutation = `
mutation pageCreate($page: PageCreateInput!) {
  pageCreate(page: $page) {
    page {
      id
      title
      handle
      templateSuffix
    }
    userErrors {
      field
      message
    }
  }
}
`;

async function main() {
  console.log('Creating Experiences page...');
  const expRes = await runGraphQL(pageCreateMutation, {
    page: {
      title: 'Experiences & Private Bookings',
      handle: 'experiences',
      templateSuffix: 'experiences',
      body: '<p>Reserve exclusive cocktail tastings, luxury mobile bar catering, and private mixology masterclasses with Lucky Shaker.</p>'
    }
  });
  console.log('Experiences Page Result:', JSON.stringify(expRes, null, 2));

  console.log('Creating Our Story page...');
  const storyRes = await runGraphQL(pageCreateMutation, {
    page: {
      title: 'Our Story & Liquid Craftsmanship',
      handle: 'our-story',
      templateSuffix: '',
      body: '<div class="story-editorial-container"><p class="story-lead">Born from the vision of master mixologist Katherin, Lucky Shaker elevates ready-to-serve cocktails to world-class lounge standards.</p><p>Every formula begins with authentic single-estate spirits, cold-pressed fruit reductions, and whole botanical infusions—free from artificial syrups, artificial coloring, or high-fructose additives. Hand-batched and vacuum-sealed in heavy glass bottles, each 750ml bottle delivers 6 to 8 full-sized, bar-quality cocktails wherever life is celebrated.</p></div>'
    }
  });
  console.log('Our Story Page Result:', JSON.stringify(storyRes, null, 2));
}

main().catch(console.error);
