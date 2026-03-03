let protocol = location.protocol;
 
if (K_PROTOCOL_SSL == undefined) var K_PROTOCOL_SSL = "https://";
if (K_PROTOCOL_NOSSL == undefined) var K_PROTOCOL_NOSSL = "http://";

if (protocol === K_PROTOCOL_SSL.substring(0, 6) && basePath.sgeoAPi.startsWith(K_PROTOCOL_NOSSL)) {
    basePath.sgeoAPi = K_PROTOCOL_SSL + basePath.sgeoAPi.substring(7);
    basePath.sgeoWEB = K_PROTOCOL_SSL + basePath.sgeoWEB.substring(7);
}
if (protocol === K_PROTOCOL_NOSSL.substring(0, 5) && basePath.sgeoAPi.startsWith(K_PROTOCOL_SSL)) {
    basePath.sgeoAPi = K_PROTOCOL_NOSSL + basePath.sgeoAPi.substring(8);
    basePath.sgeoWEB = K_PROTOCOL_NOSSL + basePath.sgeoWEB.substring(8);
} 