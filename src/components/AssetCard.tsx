import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "slices/store";
import { setAssetSelected } from "slices/viewState";

interface IAssetCardProps {
  asset: IAsset;
  collectionInfo: ICollectionInfo;
}

const AssetCard = (props: IAssetCardProps) => {
  const { asset, collectionInfo } = props;
  const dispatch = useDispatch<AppDispatch>();
  const selectedAssets = useSelector<RootState, { [key: string]: boolean }>(
    (state) => state.viewState.selectedAssets
  );

  const onClick = () => {
    dispatch(
      setAssetSelected({
        assetAddress: collectionInfo.address + "_" + asset.tokenId,
        value: !selectedAssets[collectionInfo.address + "_" + asset.tokenId],
      })
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#f0f0f0",
        cursor: "pointer",
        border: selectedAssets[collectionInfo.address + "_" + asset.tokenId]
          ? "4px solid #0088cc"
          : "",
      }}
      onClick={onClick}
    >
      <img src={asset.image} alt={asset.name} />
      <Box padding={2}>
        <Typography variant="body1" gutterBottom>
          {asset.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {collectionInfo.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default AssetCard;
