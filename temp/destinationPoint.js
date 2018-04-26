lat2 =asin(sin(lat1)*cos(d)+cos(lat1)*sin(d)*cos(tc))
dlon=atan2(sin(tc)*sin(d)*cos(lat1),cos(d)-sin(lat1)*sin(lat2))
lon2=mod( lon1-dlon +pi,2*pi )-pi

