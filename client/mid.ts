// node-machine-id - Because parcel is stupid!
import { nodeRequire } from "./util";

const { platform } = global.process;
const guid = {
  darwin: "ioreg -rd1 -c IOPlatformExpertDevice",
  win32Native:
    "%windir%\\System32" +
    "\\REG QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\" +
    "Cryptography /v MachineGuid",
  win32Mixed:
    "%windir%\\sysnative\\cmd.exe /c %windir%\\System32" +
    "\\REG QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\" +
    "Cryptography /v MachineGuid",
  linux:
    "( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null" +
    " || hostname ) | head -n 1 || :",
  freebsd: "kenv -q smbios.system.uuid"
};

function hash(guid: string): string {
  const { createHash } = nodeRequire("crypto");
  return createHash("sha256")
    .update(guid)
    .digest("hex");
}

function expose(result: string): string {
  switch (platform) {
    case "darwin":
      return result
        .split("IOPlatformUUID")[1]
        .split("\n")[0]
        .replace(/\=|\s+|\"/gi, "")
        .toLowerCase();
    case "win32":
      return result
        .toString()
        .split("REG_SZ")[1]
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
    case "linux":
      return result
        .toString()
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
    case "freebsd":
      return result
        .toString()
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

export function machineIdSync(original?: boolean): string {
  let id: string;
  const { execSync } = nodeRequire("child_process");
  if (platform === "win32") {
    try {
      id = expose(execSync(guid.win32Native).toString());
    } catch (e) {
      id = expose(execSync(guid.win32Mixed).toString());
    }
  } else {
    id = expose(execSync(guid[platform]).toString());
  }
  return original ? id : hash(id);
}
