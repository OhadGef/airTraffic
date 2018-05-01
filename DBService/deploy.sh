
echo "start deploy"

version=$1

echo "version $version"
if [ -z "$version" ]
then
	echo "Missing deployment version"
	exit 1
fi

echo "start deploying version $version on airtraffic-dbservice"

eval $(aws ecr get-login --no-include-email --region eu-central-1)

docker build -t "airtraffic-dbservice:$version" .

docker tag airtraffic-dbservice:"$version" "airtraffic-dbservice:latest"

docker tag "airtraffic-dbservice:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-dbservice:latest"

docker tag "airtraffic-dbservice:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-dbservice:$version"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-dbservice:latest"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-dbservice:$version"

echo "deployment succeeded";

PAUSE
read -n1 -r -p "Press any key to continue..." key