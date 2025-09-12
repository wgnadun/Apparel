import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReview } from "@/store/shop/review-slice";
import { toast } from "sonner";
import { useFormValidation } from "../../hooks/useFormValidation";
import { reviewSchema, fieldHints } from "../../utils/validation";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  // Use validation hook for review form
  const {
    formData: reviewData,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
    isFormValid,
    resetForm
  } = useFormValidation(reviewSchema, { reviewMessage: '', reviewValue: 0 });


  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");
    handleInputChange('reviewValue', getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
         
          toast( `Only ${getQuantity} quantity can be added for this item`,{
            style : {
              background : 'white',
              color : "red"
            }
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
       toast(`Product is added to cart`, {
            style: {
              background: 'white',
              color: 'green'
            }
          });

      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    resetForm({ reviewMessage: '', reviewValue: 0 });
  }

  function handleAddReview(data) {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: data.reviewMessage,
        reviewValue: data.reviewValue,
      })
    ).then((response) => {
      if (response?.payload?.success) {
        resetForm({ reviewMessage: '', reviewValue: 0 });
        dispatch(getReview(productDetails?._id));
      toast(`Review added successfully!`, {
              style: {
                background: 'white',
                color: 'green'
              }
            });

      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReview(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
       <div className="group relative overflow-hidden rounded-lg place-items-center m-20">
  <img
    src={productDetails?.image}
    alt={productDetails?.title}
    width={600}
    height={600}
    className="h-[600px] w-auto object-contain transition-transform duration-500 ease-out scale-110 group-hover:scale-100"
  />
</div>

        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <div className="text-muted-foreground text-sm mb-5 mt-4">
   <ul className="list-disc list-outside pl-5 text-left text-muted-foreground text-sm mb-5 mt-4">
  {productDetails?.description
    ?.split("\n")
    .map((line, i) => (
      <li key={i}>{line}</li>
    ))}
</ul>


            </div>

          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <form onSubmit={handleSubmit(handleAddReview)} className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={reviewData.reviewValue}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              {getFieldError('reviewValue') && (
                <p className="text-sm text-red-500">{getFieldError('reviewValue')}</p>
              )}
              <Input
                name="reviewMessage"
                value={reviewData.reviewMessage}
                onChange={(e) => handleInputChange('reviewMessage', e.target.value)}
                onBlur={() => handleFieldBlur('reviewMessage')}
                placeholder={fieldHints.reviewMessage}
                className={hasFieldError('reviewMessage') ? "border-red-500 focus:border-red-500" : ""}
              />
              {getFieldError('reviewMessage') && (
                <p className="text-sm text-red-500">{getFieldError('reviewMessage')}</p>
              )}
              <Button
                type="submit"
                disabled={!isFormValid}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;