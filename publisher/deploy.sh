
echo "start deploy"

version=$1

echo "version $version"
if [ -z "$version" ]
then
	echo "Missing deployment version"
	exit 1
fi

echo "start deploying version $version on airtraffic-publisher"

eval $(aws ecr get-login --no-include-email --region eu-central-1)

docker build -t "airtraffic-publisher:$version" .

docker tag airtraffic-publisher:"$version" "airtraffic-publisher:latest"

docker tag "airtraffic-publisher:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-publisher:latest"

docker tag "airtraffic-publisher:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-publisher:$version"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-publisher:latest"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/airtraffic-publisher:$version"

echo "deployment succeeded";

PAUSE
read -n1 -r -p "Press any key to continue..." key