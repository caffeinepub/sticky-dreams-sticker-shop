import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Sticker = {
    id : Text;
    title : Text;
    description : Text;
    price : Text;
    category : Text;
    imageUrl : Text;
    amazonLink : Text;
    pinterestLink : Text;
    featured : Bool;
    createdAt : Time.Time;
  };

  module Sticker {
    public func compareByTitle(a : Sticker, b : Sticker) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  // Sticker storage
  let stickerMap = Map.empty<Text, Sticker>();

  // Initialize with sample stickers
  public shared ({ caller }) func seedStickers() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed stickers");
    };

    let samples : [Sticker] = [
      {
        id = "1";
        title = "Cute Panda";
        description = "Adorable panda sticker perfect for laptops";
        price = "$3.99";
        category = "cute animals";
        imageUrl = "https://example.com/panda.png";
        amazonLink = "https://amazon.com/panda-sticker";
        pinterestLink = "https://pinterest.com/panda-sticker";
        featured = true;
        createdAt = Time.now();
      },
      {
        id = "2";
        title = "Rose Bouquet";
        description = "Elegant floral sticker";
        price = "$4.50";
        category = "floral";
        imageUrl = "https://example.com/rose.png";
        amazonLink = "https://amazon.com/rose-sticker";
        pinterestLink = "https://pinterest.com/rose-sticker";
        featured = false;
        createdAt = Time.now();
      },
      {
        id = "3";
        title = "Stay Positive";
        description = "Motivational phrase sticker";
        price = "$3.75";
        category = "fun phrases";
        imageUrl = "https://example.com/positive.png";
        amazonLink = "https://amazon.com/positive-sticker";
        pinterestLink = "https://pinterest.com/positive-sticker";
        featured = true;
        createdAt = Time.now();
      },
      {
        id = "4";
        title = "Spring Blossoms";
        description = "Beautiful spring flowers";
        price = "$4.25";
        category = "seasonal";
        imageUrl = "https://example.com/spring.png";
        amazonLink = "https://amazon.com/spring-sticker";
        pinterestLink = "https://pinterest.com/spring-sticker";
        featured = false;
        createdAt = Time.now();
      },
      {
        id = "5";
        title = "Sleepy Cat";
        description = "Cute sleeping cat sticker";
        price = "$3.99";
        category = "cute animals";
        imageUrl = "https://example.com/cat.png";
        amazonLink = "https://amazon.com/cat-sticker";
        pinterestLink = "https://pinterest.com/cat-sticker";
        featured = false;
        createdAt = Time.now();
      },
      {
        id = "6";
        title = "Sunflower";
        description = "Bright sunflower sticker";
        price = "$4.99";
        category = "floral";
        imageUrl = "https://example.com/sunflower.png";
        amazonLink = "https://amazon.com/sunflower-sticker";
        pinterestLink = "https://pinterest.com/sunflower-sticker";
        featured = true;
        createdAt = Time.now();
      },
      {
        id = "7";
        title = "Good Vibes Only";
        description = "Positive energy phrase sticker";
        price = "$3.50";
        category = "fun phrases";
        imageUrl = "https://example.com/vibes.png";
        amazonLink = "https://amazon.com/vibes-sticker";
        pinterestLink = "https://pinterest.com/vibes-sticker";
        featured = false;
        createdAt = Time.now();
      },
      {
        id = "8";
        title = "Winter Snowflake";
        description = "Delicate winter snowflake design";
        price = "$4.00";
        category = "seasonal";
        imageUrl = "https://example.com/snowflake.png";
        amazonLink = "https://amazon.com/snowflake-sticker";
        pinterestLink = "https://pinterest.com/snowflake-sticker";
        featured = false;
        createdAt = Time.now();
      },
    ];

    for (sticker in samples.values()) {
      stickerMap.add(sticker.id, sticker);
    };
  };

  // Admin CRUD operations
  public shared ({ caller }) func addSticker(sticker : Sticker) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add stickers");
    };

    if (stickerMap.containsKey(sticker.id)) {
      Runtime.trap("Sticker with this ID already exists");
    };

    stickerMap.add(sticker.id, sticker);
  };

  public shared ({ caller }) func updateSticker(sticker : Sticker) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update stickers");
    };

    if (not (stickerMap.containsKey(sticker.id))) {
      Runtime.trap("Sticker with this ID does not exist");
    };

    stickerMap.add(sticker.id, sticker);
  };

  public shared ({ caller }) func deleteSticker(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete stickers");
    };
    if (not (stickerMap.containsKey(id))) {
      Runtime.trap("Sticker with this ID does not exist");
    };
    stickerMap.remove(id);
  };

  public shared ({ caller }) func toggleFeatured(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle featured status");
    };
    switch (stickerMap.get(id)) {
      case (null) { Runtime.trap("Sticker with this ID does not exist") };
      case (?sticker) {
        let updated = { sticker with featured = not sticker.featured };
        stickerMap.add(id, updated);
      };
    };
  };

  // Public queries - accessible to all users including guests
  public query ({ caller }) func getAllStickers() : async [Sticker] {
    stickerMap.values().toArray().sort(Sticker.compareByTitle);
  };

  public query ({ caller }) func getFeaturedStickers() : async [Sticker] {
    let featuredIter = stickerMap.values().filter(
      func(sticker) { sticker.featured }
    );
    featuredIter.toArray().sort(Sticker.compareByTitle);
  };

  public query ({ caller }) func getStickersByCategory(category : Text) : async [Sticker] {
    let categoryIter = stickerMap.values().filter(
      func(sticker) { sticker.category == category }
    );
    categoryIter.toArray().sort(Sticker.compareByTitle);
  };

  public query ({ caller }) func getStickerById(id : Text) : async ?Sticker {
    stickerMap.get(id);
  };
};
