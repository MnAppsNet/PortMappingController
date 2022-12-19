import upnpclient
import json
from flask import Flask, request, render_template

class CONSTANTS:
	PORT = 5050
	FRONTEND_STATIC = 'client/build/static'
	FRONTEND_BUILD = 'client/build'
	IGD = 'IGD'
	class PROTOCOLS:
		TCP = 'TCP'
		UDP = 'UDP'

class upnpController:
	def __init__(self):
        # Find router :
		devices = upnpclient.discover()
		self.router = None
		for device in devices:
			if CONSTANTS.IGD in device.friendly_name:
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
				NewLeaseDuration=999999)
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

app = Flask(__name__, static_folder=CONSTANTS.FRONTEND_STATIC, template_folder=CONSTANTS.FRONTEND_BUILD)
upnp = upnpController()

#Returns the frontend client
@app.route("/")
def client():
    return render_template('index.html')

#Add a new port mapping rule
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

#Remove a port mapping rule
@app.route("/removePort", methods=['POST'])
def removePort():
    data = request.get_json()
    result = upnp.closePort(
				data['externalPort'],
				data['protocol'],
				data['host'] )
    return json.dumps({'success': result}), 200, {'ContentType':'application/json'}

#Get all port mapping rules
@app.route("/getPorts", methods=['GET'])
def getPorts():
    ports = upnp.getOpenPorts();
    return json.dumps(ports), 200, {'ContentType':'application/json'}

if __name__ == "__main__":
    app.run(port=CONSTANTS.PORT, threaded=True, host='0.0.0.0')