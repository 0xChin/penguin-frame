import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use(async (c, next) => {
  await next();
  const isFrame = c.res.headers.get('content-type')?.includes('html');
  c.res.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origin if needed
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', '*');
  if (isFrame) {
    let html = await c.res.text();
    let metaTag = '<meta property="fc:frame:video:type" content="video/mp4" />';
    html = html.replace(/(<head>)/i, `$1${metaTag}`);
    metaTag = `<meta property="fc:frame:video" content="${c.req.query('video')}" />`;
    html = html.replace(/(<head>)/i, `$1${metaTag}`);
    c.res = new Response(html, {
      headers: {
        'content-type': 'text/html',
      },
    });
  }
});

app.frame('/', async (c) => {
  const asset = c.req.query('asset')
  const messageOne = c.req.query('message1')
  const messageTwo = c.req.query('message2')
  const messageThree = c.req.query('message3')
  const messageFour = c.req.query('message4')
const { buttonValue } = c


  return c.res({
    image: (
      <div
        style={{
          background: 'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
            letterSpacing: '-0.025em',
            alignItems: 'center',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {buttonValue === 'clip' ? 'Video not supported :(' : (
            <div  style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              alignItems: 'center',
              whiteSpace: 'pre-wrap',
            }}>
            <div style={{fontSize: 60, alignSelf: 'center'}}>
              Latest Comments
            </div>
            {messageOne && <div style={{marginTop: 20, backgroundColor: 'white', borderRadius: 15, fontSize: 40, padding: 10, color: 'black', alignSelf: 'flex-start'}}>
              {messageOne}
            </div>}
            {messageTwo && <div style={{marginTop: 20, backgroundColor: 'white', borderRadius: 15, fontSize: 40, padding: 10, color: 'black', alignSelf: 'flex-start'}}>
              {messageTwo}
            </div>}
            {messageThree && <div style={{marginTop: 20, backgroundColor: 'white', borderRadius: 15, fontSize: 40, padding: 10, color: 'black', alignSelf: 'flex-start'}}>
              {messageThree}
            </div>}
            {messageFour && <div style={{marginTop: 20, backgroundColor: 'white', borderRadius: 15, fontSize: 40, padding: 10, color: 'black', alignSelf: 'flex-start'}}>
              {messageFour}
            </div>}
            </div>
          )}
        </div>
      </div>
    ),
    intents: [
      <Button value="clip">Clip</Button>,
      <Button value="comments">Comments</Button>,
      <Button.Link href={`https://template-livepeer-app.vercel.app/clip/${asset}`}>Watch clip</Button.Link>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
