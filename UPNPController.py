import upnpclient
import json
from flask import Flask, request

class CONSTANTS:
	class PROTOCOLS:
		TCP = 'TCP'
		UDP = 'UDP'


class upnpController:
	def __init__(self):
        # Find router :
		devices = upnpclient.discover()
		self.router = None
		for device in devices:
			if 'IGD' in device.friendly_name:
				self.router = device

	#Enable port mapping rule
	def enablePort(self,internal_port, external_port, protocol, client, description, remoteHost = '0.0.0.0'):
		self.openPort(internal_port, external_port, protocol, client, description, '1', remoteHost)

	#Disable port mapping rule
	def disablePort(self,internal_port, external_port, protocol, client, description, remoteHost = '0.0.0.0'):
		self.openPort(internal_port, external_port, protocol, client, description, '0', remoteHost)

	#Create port mapping rule
	def openPort(self, internal_port, external_port, protocol, client, description, enabled, remoteHost = '0.0.0.0'):
		try:
			self.router.WANIPConn1.AddPortMapping(
				NewRemoteHost=remoteHost,
				NewExternalPort=external_port,
				NewProtocol=protocol,
				NewInternalPort=internal_port,
				NewInternalClient=client,
				NewEnabled=enabled,
				NewPortMappingDescription=description,
				NewLeaseDuration=10000)
			return True
		except:
			return False

	#Delete port mapping rule
	def closePort(self,external_port,protocol,remoteHost = '0.0.0.0'):
		try:
			self.router.WANIPConn1.DeletePortMapping(
				NewRemoteHost=remoteHost,
				NewExternalPort=external_port,
				NewProtocol=protocol)
			return True
		except:
			return False

	def getOpenPorts(self):
		i = 0
		rules = []
		while True:
			try:
				rule = self.router.WANIPConn1.GetGenericPortMappingEntry(NewPortMappingIndex=i)
				rules.append({
					'host': rule['NewRemoteHost'] if rule['NewRemoteHost'] != None else '0.0.0.0',
					'from': rule['NewExternalPort'],
					'protocol': rule['NewProtocol'],
					'to': rule['NewInternalPort'],
					'client': rule['NewInternalClient'],
					'description': rule['NewPortMappingDescription'],
					'enabled':rule['NewEnabled']
				})
			except:
				break
			i += 1
		return rules

app = Flask(__name__)
upnp = upnpController()

@app.route("/")
def client():
    pass

@app.route("/addPort", methods=['POST'])
def addPort():
    data = request.get_json()
    result = upnp.openPort(
				data['internalPort'],
				data['externalPort'],
				data['protocol'],
				data['client'],
				data['description'],
				'1' if data['enabled'] else '0',
				data['host'] )
    return json.dumps({'success': result}), 200, {'ContentType':'application/json'}

@app.route("/removePort", methods=['POST'])
def removePort():
    data = request.get_json()
    result = upnp.closePort(
				data['externalPort'],
				data['protocol'],
				data['host'] )
    return json.dumps({'success': result}), 200, {'ContentType':'application/json'}

@app.route("/getPorts", methods=['GET'])
def getPorts():
    ports = upnp.getOpenPorts();
    return json.dumps(ports), 200, {'ContentType':'application/json'}

if __name__ == "__main__":
    app.run()