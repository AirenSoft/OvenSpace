
server:
	docker run -d -p 3332:3332 -p 3478:3478 -p 8081:8081 -p 10006-10010:10006-10010/udp -v $(PWD)/Server.xml:/opt/ovenmediaengine/bin/origin_conf/Server.xml airensoft/ovenmediaengine:latest
