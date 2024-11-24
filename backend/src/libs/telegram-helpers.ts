
export function parseInitData(initData: string) {
    const data = initData === "" ? "{}" : initData;

    let parsedData = JSON.parse(
        '{"' + data.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
        }
    );

    return parsedData;
}

export function getTelegramUser(initData: string): WebAppUser | undefined
{
    try {
        return JSON.parse(parseInitData(initData).user) as WebAppUser;
    } catch (e) {
        return undefined;
    }
}

export function convertInitDataToArray(initData: string): {
    hash: string;
    data: string[];
} {
    const parsedData = parseInitData(initData);
    const { hash, ...dataWithoutHash } = parsedData;

    const pairs: string[] = [];

    // Iterate over all key-value pairs of parsed parameters and find required
    // parameters.
    Object.keys(dataWithoutHash)
        .sort() // Sort keys alphabetically
        .forEach((key) => {
            pairs.push(`${key}=${dataWithoutHash[key]}`);
        });

    return {
        hash,
        data: pairs,
    };
}

export async function AuthorizeTelegramRequest(
    rawData: string,
    botToken: string,
    showLogs: boolean = false
): Promise<boolean> {
    const { hash, data } = convertInitDataToArray(rawData);

    const secret_key = await createHmacHash(botToken, "WebAppData");
    const finalHash = await createHmacHash(data.join("\n"), secret_key);

    if (showLogs) {
        console.log({
            secretKey: secret_key,
            finalHash,
            requiredHash: hash,
            valid: hash === finalHash,
        });
    }

    return hash === finalHash;
}

export async function createHmacHash(
    data: string,
    key: string
): Promise<string> {
    const encoder = new TextEncoder();

    // Convert hex key to bytes if it's a hex string
    const keyBytes =
        key.length === 64
            ? new Uint8Array(
                  key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
              )
            : encoder.encode(key);

    // Import the key using bytes
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    // Sign the data
    const signature = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        encoder.encode(data)
    );

    // Convert the signature to hex
    return Array.from(new Uint8Array(signature))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export type ValidateValue = string | URLSearchParams;
export type Text = string | Buffer;
