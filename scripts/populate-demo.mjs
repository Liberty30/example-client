import { setConfig, core, createRegistration, follow } from "@dsnp/sdk";
import { providers, Wallet } from "ethers";
import fetch from "node-fetch";
import web3 from "web3-utils";
// import { createReadStream } from "fs";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const createImageAttachment = (url) => {
  return core.activityContent.createImageAttachment([
    core.activityContent.createImageLink(url, "image/jpg", [
      core.activityContent.createHash(url),
    ]),
  ]);
};

const accounts = [
  {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    // address: "0x177874E8d7BEE93a114A1dd8e0f72483C04F182f",
    handle: "NumberOneFan",
    pk: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    // pk: "0x3275230d8464f6d3e4900f68bbc75899d5236e4deaf2c27643ec16d72d606d14",
    name: "Tanya Lee",
    text: "Good food = good mood",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/36/0f/c8/360fc831d46f8523b58f0b22b1a68fc0.jpg"
      ),
    ],
    follows: [1, 2, 3, 4],
    tag: [{ name: "foodpics" }, { name: "foodblogger" }],
    avatarUrl:
      "https://i.pinimg.com/564x/09/0e/bc/090ebc18fd457be35e4bdecde20027e7.jpg",
  },
  {
    address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    // address: "0xEAd5B6046Ae8820aD02237CdD6bB6761Eb8C3B13",
    handle: "tinydancer",
    pk: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    // pk: "0xd2519d3923fcad6eb6e0f270e66407478f0f389600d57cf0497dfc8f52d5c07c",
    name: "Eva Rockett",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/6c/cb/07/6ccb07ea9b32bb0b42a4b8d2a88c1c85.jpg"
      ),
    ],
    text: "My snack beats your snack.",
    follows: [2, 3, 4, 5],
    tag: [
      { name: "#platepics" },
      { name: "wholesomemeal" },
      { name: "foodblogger" },
    ],
    avatarUrl:
      "https://i.pinimg.com/564x/2b/2d/52/2b2d5257c16f298fc168511f4243d817.jpg",
  },
  {
    address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    // address: "0x3019De92d132ECC7446950011a9ee13156D7d876",
    handle: "WasabiWomen",
    pk: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    // pk: "0xb6a772c015e073734e8b1bed33eba79f49d3d90f8dfb6feecb5530b80fddeecd",
    name: "Yuriko",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/13/62/4a/13624a6cdab47c3b5727755df39ff847.jpg"
      ),
    ],
    text: "I love wasabi!",
    follows: [3, 4, 5, 6, 7],
    tag: { name: "foodblogger" },
    avatarUrl:
      "https://i.pinimg.com/564x/0c/31/3d/0c313da4cfe42d75f9785c012ca660b9.jpg",
  },
  {
    address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    // address: "0x1408603Ced2F7e815618845DF6c95282364CF8D5",
    handle: "HealthyGirl",
    pk: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    // pk: "0x7627a2843ddc938465fffc7834447ef13f366e5a6b08880094af42e2ab09c996",
    name: "Claire O",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/be/3d/f5/be3df5cb149d794a9efdab98c094fba6.jpg"
      ),
    ],
    text: "I just don’t want to look back and think “I could’ve eaten that.",
    follows: [4, 5, 6],
    tag: [{ name: "seafood" }, { name: "sushi" }, { name: "restaurant" }],
    avatarUrl:
      "https://i.pinimg.com/564x/07/2b/36/072b3662f337307180a86d8f856323cd.jpg",
  },
  {
    address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    // address: "0xeEe9FCB6e5D3049FcdBf64e83d54103E5034c436",
    handle: "Gthomas82",
    pk: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    // pk: "0x5785c4bc3b933636bdf3be57eb06dd733b8086923737d3c45b0f7bbc1630a590",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/5e/71/47/5e714762f120e33424487d3afc9c09b8.jpg"
      ),
    ],
    text: "I love food!",
    name: "Greg Thomas",
    follows: [5, 6, 7],
    tag: [{ name: "restaurant" }],
    avatarUrl:
      "https://i.pinimg.com/564x/70/4e/17/704e17c09707d5d3dc8f975f1fcfba81.jpg",
  },
  {
    address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    // address: "0xCf04a9Cb47610d6a131550057BEA1E6C3D7cc633",
    handle: "lovestoeat",
    pk: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
    // pk: "0xfca334021a99ab7b0153b451007140c9ce1b1ab5305ff0e9be67225c24ac924e",
    name: "Alice",
    attachment: [
      createImageAttachment(
        "https://libertypostsorg.s3.us-east-2.amazonaws.com/a33cb9b4-b8ed-421c-a14d-4799c3c667ee.jpg"
      ),
    ],
    text: "Fish and rice make everything nice.",
    tag: [
      { name: "#sushilovers" },
      { name: "#sushipics" },
      { name: "#foodblogger" },
      { name: "#restaurant" },
    ],
    follows: [0, 1, 2, 3, 4],
    avatarUrl:
      "https://libertypostsorg.s3.us-east-2.amazonaws.com/f0278754-f3df-441b-a8bf-7268a8cad4d2.jpg",
  },
  {
    address: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    // address: "0xe9846b6D36FD7A04946F2008DbB44e99c31B679F",
    handle: "nosoup4you",
    pk: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    // pk: "0xf7bb95a92fc990f3193ba6471b33ece391368fc563a2ae5b2f6cd1aa8c65e892",
    name: "Amit",
    text:
      "I found this little hole in the wall – look at this deliciousness they served up.",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/72/1a/14/721a1400823638036e3167e1e426a624.jpg"
      ),
    ],
    follows: [6, 7, 3, 2, 1],
    tag: [
      { name: "foodpics" },
      { name: "foodblogger" },
      { name: "rollsandrolls" },
    ],
    avatarUrl:
      "https://i.pinimg.com/564x/ec/34/ed/ec34ed0d8d19133092613e252288d201.jpg",
  },
  {
    address: "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    // address: "0xFaFA6823B36DE1e63C7795f64Bde942A1401E172",
    handle: "moremoremore",
    pk: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    // pk: "0x770c56dbfa8f40a902a626161c5a8ede8673501a85517b82c6ec2e2e2b94586c",
    name: "Rosie",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/d8/21/82/d82182e5eff9c82ac9bf3bc9be5f8ce7.jpg"
      ),
    ],
    text: "Surround yo-self with sushi, not negativity.",
    tag: [
      { name: "#restaurant" },
      { name: "#food" },
      { name: "#rollsandrolls" },
    ],
    follows: [7, 0, 1],
    avatarUrl:
      "https://i.pinimg.com/564x/46/0b/bb/460bbb059c45b4fd0672aefb1dde7b30.jpg",
  },
  {
    address: "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
    // address: "0xCf04a9Cb47610d6a131550057BEA1E6C3D7cc633",
    handle: "neverenough ",
    pk: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    // pk: "0xfca334021a99ab7b0153b451007140c9ce1b1ab5305ff0e9be67225c24ac924e",
    name: "Bob",
    attachment: [
      createImageAttachment(
        "https://i.pinimg.com/564x/1c/3b/ac/1c3bac1e2d25437cf2134fd41caada6c.jpg"
      ),
    ],
    text: "Good food is very often simple food.",
    tag: [
      { name: "#salmon" },
      { name: "#freshfish" },
      { name: "#foodblogger" },
    ],
    follows: [0, 1, 2, 3, 4],
    avatarUrl:
      "https://i.pinimg.com/564x/c7/45/de/c745deb0177e4584d2d6e1ff11ae8c7c.jpg",
  },
  {
    address: "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
    // address: "0xCf04a9Cb47610d6a131550057BEA1E6C3D7cc633",
    handle: "lovestoeat ",
    pk: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
    // pk: "0xfca334021a99ab7b0153b451007140c9ce1b1ab5305ff0e9be67225c24ac924e",
    name: "Alice",
    attachment: [
      createImageAttachment(
        "https://libertypostsorg.s3.us-east-2.amazonaws.com/c6a533f1-542a-4998-ab77-12c10bd98368.jpg"
      ),
    ],
    text: "Let's get sushi, just for the halibut! 😆",
    tag: [
      { name: "#sushilovers" },
      { name: "#sushipics" },
      { name: "#foodblogger" },
      { name: "#restaurant" },
    ],
    follows: [0, 1, 2, 3, 4],
    avatarUrl:
      "https://libertypostsorg.s3.us-east-2.amazonaws.com/f0278754-f3df-441b-a8bf-7268a8cad4d2.jpg",
  },
];

/**
 * Store implementation.
 */

class Store {
  put(targetPath) {
    return Promise.resolve(
      new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`)
    );
  }

  async putStream(targetPath, doWriteToStream) {
    const ws = new ServerWriteStream(targetPath);
    await doWriteToStream(ws);
    return new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`);
  }
}

const isFunction = (o) => typeof o == "function";
const isUint8Array = (o) =>
  typeof o == "object" && o.constructor === Uint8Array;

class ServerWriteStream {
  chunks = [];
  targetPath;

  constructor(path) {
    this.targetPath = path;
  }

  write(chunk, param1, param2) {
    const cb = typeof param1 == "string" ? param2 : param1;

    this.chunks.push(chunk);

    if (cb) cb(null);
    return true;
  }

  end(...args) {
    if (isUint8Array(args[0])) {
      this.chunks.push(args[0]);
    }

    let cb;
    if (isFunction(args[0])) {
      cb = args[0];
    } else if (isFunction(args[1])) {
      cb = args[1];
    } else {
      cb = args[2];
    }

    const fileLength = this.chunks.reduce((m, s) => m + s.length, 0);
    const file = new ArrayBuffer(fileLength);
    const bytes = new Uint8Array(file);
    for (let i = 0, offset = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }

    fetch(
      `${
        process.env.REACT_APP_UPLOAD_HOST
      }/upload?filename=${encodeURIComponent(this.targetPath)}`,
      {
        method: "POST",
        mode: "cors",
        body: file,
      }
    ).then((res) => {
      if (res.status !== 201) {
        throw Error(`failed to post stream: ${res.status} ${res.statusText}`);
      }
      if (cb) cb();
    });
  }
}

/**
 * Populate chain and storage server
 */

setConfig({
  store: new Store(),
});

const dsnpIdToURI = (dsnpId) =>
  core.identifiers.convertBigNumberToDSNPUserURI(
    core.identifiers.convertDSNPUserIdOrURIToBigNumber(dsnpId)
  );

const storeAnnouncement = async (content, accountId, signer) => {
  const hash = web3.keccak256(core.activityContent.serialize(content));

  // store note content
  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${encodeURIComponent(
      hash + ".json"
    )}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );

  // create and store announcement of content to batch
  const announcement = core.announcements.sign(
    core.announcements.createBroadcast(
      accountId,
      `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
      hash
    ),
    { signer: signer }
  );

  return { hash, announcement };
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storeAvatar = async (avatarUrl) => {
  return core.activityContent.createImageLink(
    avatarUrl,
    "image/jpg",
    [core.activityContent.createHash("0x123")],
    { height: 72, width: 72 }
  );
};

/**
 * Populate all profiles and notes
 */
for await (let account of accounts.values()) {
  console.log("Setting up account", account.address);

  const provider = new providers.JsonRpcProvider(
    process.env.REACT_APP_CHAIN_HOST
  );

  const wallet = new Wallet(account.pk, provider);
  setConfig({
    signer: wallet,
    provider: provider,
  });

  // register handle to get dsnp id
  account.id = await createRegistration(account.address, account.handle);

  // store avatar
  const avatar = await storeAvatar(account.avatarUrl);

  // create profile
  const profile = core.activityContent.createProfile({
    name: account.name,
    icon: [avatar],
  });
  profile.published = Date.now.toString(16);

  // create a note
  const content = core.activityContent.createNote(account.text, {
    attachment: account.attachment,
  });
  content.published = new Date().toISOString();
  if (account.tag) content.tag = account.tag;

  const {
    hash: profileHash,
    announcement: profileAnnouncement,
  } = await storeAnnouncement(profile, account.id, wallet);

  const {
    hash: contentHash,
    announcement: noteAnnouncement,
  } = await storeAnnouncement(content, account.id, wallet);

  const hash = web3.keccak256(profileHash + contentHash);

  const batchData = await core.batch.createFile(hash + ".parquet", [
    profileAnnouncement,
    noteAnnouncement,
  ]);

  const publication = {
    announcementType: core.announcements.AnnouncementType.Broadcast,
    fileUrl: batchData.url.toString(),
    fileHash: batchData.hash,
  };

  await core.contracts.publisher.publish([publication], { signer: wallet });
}

/**
 * Populate follows
 */
for await (let account of accounts.values()) {
  console.log("Setting up follows", account.address);

  const provider = new providers.JsonRpcProvider(
    process.env.REACT_APP_CHAIN_HOST
  );

  const wallet = new Wallet(account.pk, provider);
  setConfig({
    signer: wallet,
    provider: provider,
  });

  // create follow
  const follows = await Promise.all(
    account.follows.map((accountIndex) =>
      follow(dsnpIdToURI(accounts[accountIndex].id), {
        currentFromURI: dsnpIdToURI(account.id),
      })
    )
  );

  const hash = web3.keccak256(follows.reduce((m, f) => m + f.signature, ""));

  const batchData = await core.batch.createFile(hash + ".parquet", follows);

  const publication = {
    announcementType: core.announcements.AnnouncementType.GraphChange,
    fileUrl: batchData.url.toString(),
    fileHash: batchData.hash,
  };

  await core.contracts.publisher.publish([publication], { signer: wallet });
}

console.log("All accounts created.");
