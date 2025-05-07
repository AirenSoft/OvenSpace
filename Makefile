
server:
	docker run -d -p 1935:1935 -p 9999:9999 -p 3332:3332 -p 3478:3478 -p 10000-10005:10000-10005/udp -p 8081:8081 -v $PWD/Server.xml:/opt/ovenmediaengine/bin/origin_conf/Server.xml airensoft/ovenmediaengine:latest
